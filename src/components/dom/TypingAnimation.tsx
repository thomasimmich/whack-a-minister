import { Component } from 'react';

interface Props {
  s: string;
  lg?: boolean;
}

interface State {
  s: string;
  typing: boolean;
}

export default class TypingAnimation extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      s: "",
      typing: true,
    };
  }

  componentDidMount() {
    this.animateText();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.s !== this.props.s) {
      this.setState({s: "", typing: true}, () => {
        this.animateText();
      });
    }
  }

  animateText = () => {
    const { s } = this.props;
    const { typing } = this.state;
    if (typing) {
      const newLetter = s.charAt(this.state.s.length);
      if (newLetter === "") {
        this.setState({typing: false});
        return;
      }
      this.setState({s: this.state.s + newLetter}, () => {
        setTimeout(this.animateText, 8);
      });
    }
  }

  render() {
    //const { lg } = this.props;
    //const className = lg ? 'ml-4 text-On-Surface-Variant mt-5 text-lg' : 'ml-4 text-On-Surface-Variant mt-5';
    return (
      <div >{this.state.s}</div>
    );
  }
}