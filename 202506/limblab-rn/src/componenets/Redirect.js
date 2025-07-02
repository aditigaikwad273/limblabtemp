import React from "react"
import { Image } from "react-native"

class RedirectImage extends React.PureComponent {
	constructor(props) {
		super(props)
		this.state = { uri: null }
	}

	componentDidMount() {
		fetch(this.props.source.uri).then((response) => {
			this.setState({ uri: response.status === 200 ? response.url : null })
		})
	}

	render() {
		return <Image {...this.props} source={{ uri: this.state.uri }} />
	}
}

export default RedirectImage
