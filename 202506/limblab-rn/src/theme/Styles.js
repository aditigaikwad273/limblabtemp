import Colors from "./Colors"

const Styles = {
	mainContainer: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	homeContainer: {
		flex: 1,
		backgroundColor: Colors.lightGreen,
	},
	semiBoldFont: {
		fontFamily: "Quicksand-SemiBold",
	},
	boldFont: {
		fontFamily: "Quicksand-Bold",
	},
	mediumFont: {
		fontFamily: "Quicksand-Medium",
		fontWeight: "500",
	},
	regularFont: {
		fontFamily: "Quicksand-Regular",
	},
	sfSemiBoldFont: {
		fontFamily: "SFPro-SemiBold",
	},
	sfBoldFont: {
		fontFamily: "SFPro-Bold",
	},
	sfMediumFont: {
		fontFamily: "SFPro-Medium",
		fontWeight: "500",
	},
	sfRegularFont: {
		fontFamily: "SFPro-Regular",
	},
	padded: {
		padding: 20,
	},
	addDropShadow: {
		shadowColor: Colors.black,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
}

export default Styles
