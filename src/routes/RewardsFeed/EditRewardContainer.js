import React from "react";
import {Alert} from 'react-native';
import CreateRewardView from './CreateRewardView';
import familyUnitRepository from "../../stores/FamilyUnitDataStore";
import userRepository from "../../stores/UserDataStore";
import rewardsRepository from "../../stores/DefaultRewardsStore";

class EditRewardContainer extends React.Component {
    state = {
        _id: null,
        modalVisible: false,
        modalText: 'Success',
        rewardName: '',
        rewardAppliesTo: [],
        kkCost: '',
        notes: '',
        submitting: false,
    }
    componentDidMount() {
        const {match: {params: {rewardid}}} = this.props;
        const currentReward = familyUnitRepository.existingRewards.find(r => r._id === rewardid);
        if (!currentReward) return Alert.alert("Error", "Error while loading reward data from memory");
        if (!familyUnitRepository.kidsList) return Alert.alert("Error", "Error while loading reward data (loading kids list) from memory");
        const rewardAppliesTo = familyUnitRepository.kidsList.filter(kid => kid.eligibleRewards.includes(rewardid)).map(kid => kid._id);
        this.setState( () => ({
            _id: currentReward._id,
            rewardName: currentReward.name,
            kkCost: currentReward.kkCost,
            notes: currentReward.notes,
            rewardAppliesTo
        }))
    }
    updateForm = (prop, newVal) => {
        this.setState(prevState => ({
            [prop]: newVal
        }));
    }
    toggleKidSelection = (kidId) => {
        if (this.state.rewardAppliesTo.indexOf(kidId) === -1)
            this.setState({rewardAppliesTo: [...this.state.rewardAppliesTo, kidId]});
        else
            this.setState({rewardAppliesTo: this.state.rewardAppliesTo.filter(kId => kId !== kidId)});
    }
    modalClose = () => this.setState(()=> ({modalVisible: false}))
    modalAddAnotherReward = () => {
        this.setState(() => ({modalVisible: false}));
        this.props.history.push('/maintabscreen/createreward');
    }
    modalBackToDashboard = () => {
        this.setState(() => ({modalVisible: false}));
        if (this.props.history) this.props.history.push('/maintabscreen/rewardsfeed');
    }
    submitReward = async () => {
        if (this.state.submitting) return;
        this.setState( _ => ({submitting: true}));
        const {
            _id,
            rewardName,
            rewardAppliesTo,
            kkCost,
            notes
        } = this.state;

        if (!rewardName) return Alert.alert("Incorrect Input", "Please specify a reward name");
        if (typeof kkCost !== 'number') return Alert.alert("Incorrect Input", "Please enter a cost for this reward");


        try {
            await familyUnitRepository.updateReward({_id, rewardName, rewardAppliesTo, kkCost, notes}, userRepository.idToken);
        }
        catch(err){
            console.log(err);
            Alert.alert("API error", (typeof err === 'object' ? JSON.stringify(err, null,2) : err.toString()));
        }
        finally {
            this.setState( _ => ({submitting: false, modalVisible: true, modalText: 'Reward edited!'}));
        }
    }
    render() {
        const {kidsList} = familyUnitRepository;
        return (
            <CreateRewardView
                {...this.props}
                {...this.state}
                updateForm={this.updateForm}
                kidsList={kidsList}
                toggleKidSelection={this.toggleKidSelection}
                submitReward={this.submitReward}
                modalAccept={this.modalAddAnotherReward}
                modalClose={this.modalClose}
                modalDeny={this.modalBackToDashboard}
            />
        );
    }
}

export default EditRewardContainer;