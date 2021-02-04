import React from 'react';
import { Alert, Platform } from 'react-native';
import AddChildView from './AddChildView';
import familyUnitRepository from '../../stores/FamilyUnitDataStore';
import { observer } from 'mobx-react';
import userRepository from '../../stores/UserDataStore';

const defaultFormState = {
	dobM: Platform.OS === 'ios' ? 1 : '',
	dobD: Platform.OS === 'ios' ? 1 : '',
	dobY: Platform.OS === 'ios' ? new Date().getFullYear() : '',
	gender: '',
};

class AddChildContainer extends React.Component {
	state = {
		firstName: '',
		...defaultFormState,
		modalVisible: false,
		modalText: 'Child added!',
		submitting: false,
	};
	modalClose = () => {
		console.log('modalClose handler called');
		this.setState(() => ({ modalVisible: false }));
	};
	addAnotherChild = () => {
		this.setState(() => ({ ...defaultFormState, modalVisible: false }));
	};
	returnToDashboard = () => {
		this.setState(() => ({ modalVisible: false }));
		if (this.props.history) {
			console.log('#############attempting redirect');
			this.props.history.push('/maintabscreen/choreboard');
		} else {
			console.log('#############attempting redirect, failed');
		}
	};

	onDeleteChild = (child) => {
		Alert.alert(
			'Confirm child Deletion',
			`Are you sure you wish to remove ${child.name} from this family unit?`,
			[
				{
					text: 'Ok',
					onPress: () =>
						familyUnitRepository.deleteChild(
							child._id,
							userRepository.idToken
						),
				},
				{ text: 'Cancel', onPress: () => '' },
			]
		);
	};

	updateForm = (prop, newValue) => {
		this.setState({ [prop]: newValue });
	};
	isValidDOB(dob) {
		const numeric = dob.split('-').map(Number);
		return (
			numeric.length === 3 &&
			numeric.every((num) => num > 0) &&
			numeric[0] < 13 &&
			numeric[1] < 32 &&
			numeric[3] <= new Date().getFullYear()
		);
	}

	onAddChild = async () => {
		console.log('ONADDCHILD CALLED');
		this.setState(() => ({ submitting: true }));
		const { firstName, dobM, dobD, dobY, gender } = this.state;
		const dob = `${dobM}-${dobD}-${dobY}`;
		if (!firstName || !dob || !gender) {
			this.setState(() => ({ submitting: false }));
			return Alert.alert('Invalid input', 'Please fill out all fields.');
		}
		if (this.isValidDOB(dob)) {
			this.setState(() => ({ submitting: false }));
			return Alert.alert(
				'Invalid DOB',
				'Please enter date of birth in format mm/dd/yyyy'
			);
		}
		const idToken = userRepository.idToken;
		const saveResult = await familyUnitRepository.addChild(
			firstName,
			dob,
			gender === 'm' ? 'male' : 'female',
			idToken
		);
		if (!saveResult)
			return Alert.alert('Server Error', 'Please try again later');
		console.log('add Child Result', saveResult);
		this.setState(() => ({ modalVisible: true, submitting: false }));

		// this.setState(() => ({ firstName: "", dob: "", gender: ""}));
		// this.showAlert();
	};

	render() {
		return (
			<AddChildView
				{...this.state}
				kidsList={familyUnitRepository.kidsList}
				onAddChild={this.onAddChild}
				onChangeText={this.updateForm}
				onDeleteChild={this.onDeleteChild}
				modalClose={this.modalClose}
				modalAccept={this.addAnotherChild}
				modalDeny={this.returnToDashboard}
			/>
		);
	}
}

export default observer(AddChildContainer);
