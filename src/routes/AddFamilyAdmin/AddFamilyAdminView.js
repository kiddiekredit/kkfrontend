import React, { Fragment } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Text from '../../common/KKText';
import KKTextInput from '../../common/KKTextInput';
import FullPageWithModal from '../../common/FullPageWithModal';
import Header from '../../common/Header';
import { fountainBlue, shuttleGrey, shuttleGreyDark } from '../../colors';
import KKButton from '../../common/KKButton';
import { Ionicons } from 'react-native-vector-icons';
import { scaleRatio } from '../../configuration';
import AdultModalContent from '../../common/AdultModalContent';

const { width, height } = Dimensions.get('window');
const renderModalContents = (modalText, modalAccept, modalDeny) => () => (
	<AdultModalContent
		modalText={modalText}
		modalAccept={modalAccept}
		modalDeny={modalDeny}
		acceptLabel={'Add another admin'}
		denyLabel={'Back to Account Manager'}
	/>
);

const AddFamilyAdminView = ({
	closeModal,
	email,
	modalAccept,
	modalClose,
	modalDeny,
	modalVisible,
	submitAddAdmin,
	submitting,
	updateForm,
}) => (
	<FullPageWithModal
		modalClose={modalClose}
		renderModalContents={renderModalContents(
			'Admin added!',
			modalAccept,
			modalDeny
		)}
		modalVisible={modalVisible}
	>
		<Header />
		<View
			style={{
				flex: 1,
				alignSelf: 'stretch',
				alignItems: 'center',
				justifyContent: 'space-around',
			}}
		>
			<Text
				style={{
					color: fountainBlue,
					fontSize: 18 * scaleRatio,
					textAlign: 'center',
				}}
			>
				Add Family Admin
			</Text>
			<KKTextInput
				keyboardType={'email-address'}
				value={email}
				placeholder={'Enter email address of new admin'}
				onChangeText={updateForm}
				style={styles.input}
			/>
			<Text
				style={{
					color: shuttleGrey,
					fontSize: 15 * scaleRatio,
					textAlign: 'center',
					marginHorizontal: 10 * scaleRatio,
				}}
			>
				Important note: you can only add a family admin if they don't
				already have a Kiddie Kredit account under that email (the
				operation will fail). You can add them under another email they
				haven't yet registered, and they can then complete the
				registration process with that email.
			</Text>
			<KKButton
				type={'primary'}
				onPress={submitAddAdmin}
				disabled={submitting}
			>
				{submitting ? 'PLEASE WAIT' : 'ADD PARENT'}
			</KKButton>
		</View>
	</FullPageWithModal>
);

const styles = StyleSheet.create({
	input: {
		borderRadius: 12,
		elevation: 6,
		shadowOpacity: 0.2,
		shadowColor: 'black',
		marginHorizontal: width * 0.08,
		marginVertical: height * 0.01,
		shadowOffset: { width: 0, height: 3 },
	},
	textLabel: {
		margin: width * 0.03,
		marginTop: width * 0.06,
		textAlign: 'center',
		color: shuttleGreyDark,
	},
	modalBtn: {
		width: 0.7 * width,
		borderRadius: 8,
		borderWidth: 2,
		backgroundColor: 'white',
		flexDirection: 'row',
		marginBottom: width * 0.015,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default AddFamilyAdminView;
