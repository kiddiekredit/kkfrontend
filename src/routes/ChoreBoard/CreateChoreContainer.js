import React from 'react';
import { Alert } from 'react-native';
import CreateChoreView from './CreateChoreView';
import { observer } from 'mobx-react';
import familyUnitRepository from '../../stores/FamilyUnitDataStore';
import userRepository from '../../stores/UserDataStore';
import choresRepository from '../../stores/DefaultChoresStore';

@observer
class CreateChoreContainer extends React.Component {
	state = {
		choreName: '',
		choreDays: [false, false, false, false, false, false, false],
		choreFrequency: 'weekly',
		chorePriority: 2,
		choreAppliedTo: [],
		choreNotes: '',
		modalVisible: false,
		modalText: 'Success',
		monthlyChoreInterval: null,
		submitting: false,
	};

	componentDidMount() {
		choresRepository.loadChoresFromApi(userRepository.idToken);
	}
	updateForm = (field, newVal) => this.setState({ [field]: newVal });
	toggleKidSelection = (kidId) => {
		if (this.state.choreAppliedTo.indexOf(kidId) === -1)
			this.setState({
				choreAppliedTo: [...this.state.choreAppliedTo, kidId],
			});
		else
			this.setState({
				choreAppliedTo: this.state.choreAppliedTo.filter(
					(kId) => kId !== kidId
				),
			});
	};

	modalClose = () => this.setState(() => ({ modalVisible: false }));

	modalAddAnotherChore = () =>
		this.setState(() => ({
			choreName: '',
			choreDays: [false, false, false, false, false, false, false],
			choreFrequency: 'weekly',
			monthlyChoreInterval: null,
			chorePriority: 2,
			choreAppliedTo: [],
			submitting: false,
			modalVisible: false,
			choreNotes: '',
		}));

	modalBackToDashboard = () => {
		this.setState(() => ({ modalVisible: false }));
		if (this.props.history)
			this.props.history.push('/maintabscreen/choreboard');
	};

	submitChore = async () => {
		const {
			choreName,
			choreDays,
			choreFrequency,
			chorePriority,
			choreAppliedTo,
			monthlyChoreInterval,
			choreNotes,
		} = this.state;

		this.setState(() => ({ submitting: true }));

		if (choreName.length < 2) {
			this.setState(() => ({ submitting: false }));
			return Alert.alert('Invalid input', 'Please enter a chore name');
		}

		const numChoreDays = choreDays.filter((e) => e).length;

		if (choreFrequency === 'weekly' && numChoreDays === 0) {
			this.setState(() => ({ submitting: false }));
			Alert.alert(
				'Invalid input',
				'Please select at least one day of the week for a weekly chore'
			);
		}
		if (choreFrequency === 'monthly' && numChoreDays !== 1) {
			this.setState(() => ({ submitting: false }));
			Alert.alert(
				'Invalid input',
				'Please select only one day of the week for a monthly chore'
			);
		}
		if (choreFrequency === 'monthly' && monthlyChoreInterval === null) {
			this.setState(() => ({ submitting: false }));
			Alert.alert(
				'Invalid input',
				"Please select whether it's the first or last day for a monthly chore"
			);
		}

		try {
			await familyUnitRepository.addChore(
				{
					choreName,
					choreDays,
					choreFrequency,
					chorePriority,
					choreAppliedTo,
					monthlyChoreInterval,
					choreNotes,
				},
				userRepository.idToken
			);
			this.setState((state) => ({
				submitting: false,
				modalVisible: true,
				modalText: 'Chore successfully created!',
			}));
		} catch (err) {
			Alert.alert('Error posting chore', err.toString());
		}
	};

	render() {
		const { kidsList } = familyUnitRepository;
		const { choreSuggestions } = choresRepository;

		return (
			<CreateChoreView
				{...this.props}
				{...this.state}
				updateForm={this.updateForm.bind(this)}
				kidsList={kidsList}
				toggleKidSelection={this.toggleKidSelection}
				submitChore={this.submitChore}
				choreSuggestions={choreSuggestions.filter(
					(sug) =>
						sug.name
							.toLowerCase()
							.indexOf(this.state.choreName.toLowerCase()) !== -1
				)}
				modalClose={this.modalClose}
				modalAccept={this.modalAddAnotherChore}
				modalDeny={this.modalBackToDashboard}
			/>
		);
	}
}

export default CreateChoreContainer;
