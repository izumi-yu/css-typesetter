import React from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TextAction from './actions/text';
import SettingAction from './actions/setting';
import HistoryAction from './actions/history';
import Dropzone from 'react-dropzone';
import DocImage from './components/docImage';
import SettingPanel from './components/settingPanel';
import ReactTooltip from 'react-tooltip';

class Typesetter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      draggingKey: null,
      resizingKey: null,
      edittingText: this.props.text.getDefaultParams()
    };
  }

  handleChangePreviewWidth(e) {
    const previewWidth = e.target.value - 0;
    this.props.actions.setPreviewWidth(previewWidth);
  }

  handleDrag(key) {
    if (this.state.draggingKey !== key) {
      this.setState({ draggingKey: key });
    }
  }

  handleResize(key) {
    if (this.state.resizingKey !== key) {
      this.setState({ resizingKey: key });
    }
    // Dummy for reflect valu to settingPanel
    this.handleSelectText(key)
  }

  findText(key) {
    return this.props.text.texts.find((text) => {
      return text.key === key;
    });
  }

  handleSelectText(key) {
    const text = this.findText(key);
    this.setState((state) => {
      if (text && (text.key !== state.edittingText.key ||
            text.key === state.draggingKey ||
            text.key === state.resizingKey
          )) {
        state.edittingText = text;
      } else {
        state.edittingText = this.props.text.getDefaultParams();
      }
      state.draggingKey = null;
      state.resizingKey = null;
      return state;
    });
  }

  handleUpdateText(originalKey) {
    const text = this.state.edittingText;
    if (!text.key || !text.value) {
      return;
    }
    this.props.actions.updateText(text, originalKey);
    if (!this.findText(originalKey)) {
      this.setState({ edittingText: this.props.text.getDefaultParams() });
    }
  }

  handleInsertText() {
    this.props.actions.insertText(this.props.text.getDefaultParams());
  }

  handleUpdateTextParams(params, cb) {
    const originalKey = this.state.edittingText.key || params.key;
    this.setState({
      edittingText: _.extend({}, this.state.edittingText, params)
    }, () => {
      if (!!this.findText(originalKey)) {
        this.handleUpdateText(originalKey);
      } else if (_.isFunction(cb)) {
        cb();
      }
    });
  }

  render() {
    const { text, setting, actions } = this.props;
    const texts = text.texts;
    if (!setting.imagePath) {
      return (
        <div className="typesetter">
          <div className="doc-wrapper">
            <Dropzone className="image-dropzone" onDrop={actions.setImagePath}>
              <div>Try dropping an image here, or click to select an image to upload.</div>
            </Dropzone>
            <div>
              width: <input value={setting.previewWidth} onChange={this.handleChangePreviewWidth.bind(this)} />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="typesetter">
        <div className="doc-wrapper">
          <DocImage
            ref="docImage"
            {...this.props}
            edittingText={this.state.edittingText}
            handleDrag={_.throttle(this.handleDrag.bind(this), 500)}
            handleResize={_.throttle(this.handleResize.bind(this), 500)}
            handleSelectText={this.handleSelectText.bind(this)}
            handleUpdateText={this.handleUpdateText.bind(this)}
            handleUpdateTextParams={this.handleUpdateTextParams.bind(this)}
          />
          <SettingPanel
            {...this.props}
            edittingText={this.state.edittingText}
            findText={this.findText.bind(this)}
            imageClassName="doc-image"
            textClassName="text-block"
            handleSelectText={this.handleSelectText.bind(this)}
            handleUpdateText={this.handleUpdateText.bind(this)}
            handleInsertText={this.handleInsertText.bind(this)}
            handleUpdateTextParams={this.handleUpdateTextParams.bind(this)}
          />
        </div>
        <ReactTooltip />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    text: state.text,
    setting: state.setting
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.extend({},
      TextAction,
      SettingAction,
      HistoryAction
    ), dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Typesetter);

