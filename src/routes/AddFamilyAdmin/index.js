import React from 'react';
import { Alert } from 'react-native';
import { observer } from 'mobx-react';
import AddFamilyAdminView from './AddFamilyAdminView';
import familyUnitRepository from '../../stores/FamilyUnitDataStore';
import userRepository from '../../stores/UserDataStore';

@observer
class AddFamilyAdminContainer extends React.Component {
	state = {
		email: '',
		modalVisible: false,
		submitting: false,
	};

	submitAddAdmin = async () => {
		this.setState(() => ({ submitting: true }));
		if (
			!this.state.email ||
			!this.state.email.match(
				/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
			)
		) {
			this.setState(() => ({ submitting: false }));
			return Alert.alert(
				'Invalid email',
				'Please enter a valid email address'
			);
		}
		const addResult = await familyUnitRepository.addAdmin(
			this.state.email,
			userRepository.idToken
		);
		if (!addResult)
			return Alert.alert(
				'Error',
				'Something went wrong. Try again later'
			);

		this.setState(() => ({ submitting: false, modalVisible: true }));
	};
	closeModal = () => this.setState(() => ({ modalVisible: false }));
	modalAddAnotherAdmin = () => {
		this.setState(() => ({ modalVisible: false, email: '' }));
	};

	modalBackToAccountManager = () =>
		this.props.history.push('/maintabscreen/accountmanager');
	updateForm = (t) => this.setState(() => ({ email: t }));

	render() {
		return (
			<AddFamilyAdminView
				{...this.props}
				{...this.state}
				updateForm={this.updateForm}
				closeModal={this.closeModal}
				modalAccept={this.modalAddAnotherAdmin}
				modalClose={this.closeModal}
				modalDeny={this.modalBackToAccountManager}
				submitAddAdmin={this.submitAddAdmin}
			/>
		);
	}
}

export default AddFamilyAdminContainer;
