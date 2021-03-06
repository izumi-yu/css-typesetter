import React from 'react';
import _ from 'lodash';
import Modal from 'react-modal';

export default class Publishing extends React.Component {
  get modalStyle() {
    return {
      overlay: {
        zIndex: 2
      },
      content: {
        padding: '0'
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      json: ''
    }
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  handleInput(e) {
    this.setState({
      json: e.target.value
    });
  }

  handleImport() {
    this.props.actions.importTexts(this.state.json);
  }

  handleExport() {
    this.setState({
      json: JSON.stringify(this.props.texts)
    });
  }

  render() {
    return (
      <div>
        <button onClick={this.openModal.bind(this)}>show css</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal.bind(this)}
          style={this.modalStyle}
        >
          <div className="code-preview">
            <div className="preview-html">
              <pre>
                {`<div class="${this.props.imageClassName}">\n`}
                  {this.props.texts.map((text) => {
                    return `  <div class="${`${this.props.textClassName} ${text.key}`}">${text.value}</div>\n`;
                  })}
                {"</div>"}
              </pre>
            </div>
            <div className="preview-css">
              <pre>
{`.${this.props.imageClassName} {
  position: relative;
  background-size: 100% auto;
  background-image: url(<IMAGE_URL>);
  width: ${this.props.previewWidth}px;
  height: ${this.props.previewHeight}px;
  .${this.props.textClassName} {
    position: absolute;
    word-wrap: break-word;
    transform-origin: 0 0;
  }
`}
                {(() => {
                  return this.props.texts.map((text, i) => {
                    let css =`  .${text.key} {
    left: ${text.x}px;
    top: ${text.y}px;
    width: ${text.width}px;
    height: ${text.height}px;
    font-size: ${text.fontSize}px;`;
                    if (text.scale !== 1) {
                      css += `\n    transform: scale(${text.scale});`;
                    }
                    if (text.lineHeight) {
                      css += `\n    line-height: ${text.lineHeight}px;`;
                    }
                    if (text.letterSpacing) {
                      css += `\n    letter-spacing: ${text.letterSpacing}px;`;
                    }
                    if (text.textAlign != 'left') {
                      css += `\n    text-align: ${text.textAlign};`;
                    }
                    css += '\n  }\n';
                    return (
                      <span key={text.key}>
                        {css}
                      </span>
                    );
                  });
                })()}
                {'}'}
              </pre>
            </div>
          </div>
        </Modal>
        <div className="json-export">
          <div>
            <button onClick={this.handleImport.bind(this)}>import json</button>
            <button onClick={this.handleExport.bind(this)}>export json</button>
          </div>
          <textarea value={this.state.json} onChange={this.handleInput.bind(this)} />
        </div>
      </div>
    );
  }
}

