import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Link } from 'react-router-native';
import { fountainBlue, shuttleGrey } from '../colors';
import Text from './KKText';

const Touchable = ({ to, style, children, ...props }) =>
	typeof to === 'undefined' ? (
		<TouchableOpacity style={style} {...props}>
			{children}
		</TouchableOpacity>
	) : (
		<Link style={style} to={to}>
			{children}
		</Link>
	);

const KKButton = ({ children, style, type, to, ...props }) => (
	<Touchable
		style={[styles.mainContainer, style, styles[type]]}
		to={to}
		{...props}
	>
		<Text
			style={[styles.label, styles[type + 'Label'] || {}]}
			semiBold={true}
			bold={false}
		>
			{children.toUpperCase()}
		</Text>
	</Touchable>
);

KKButton.propTypes = {
	children: PropTypes.any.isRequired,
	style: PropTypes.object,
	type: PropTypes.oneOf(['primary', 'secondary', 'textOnly']),
};

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
	mainContainer: {
		width: width * 0.5,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: height * 0.02,
		borderRadius: 8,
	},
	label: {
		paddingVertical: height * 0.02,
		alignSelf: 'center',
		textAlign: 'center',
		color: 'white',
		letterSpacing: 5,
	},
	primary: {
		backgroundColor: fountainBlue,
	},
	secondary: {
		backgroundColor: shuttleGrey,
	},
	textOnly: {
		backgroundColor: 'transparent',
		letterSpacing: 1,
	},
	textOnlyLabel: {
		color: fountainBlue,
	},
});

export default KKButton;
