import React, {PureComponent} from 'react';
import './index.less';
import {connect} from 'react-redux';
import dict from '@/translations';
import {MAIL_URL} from '@/constants';
import cn from 'classnames';
import Hoverable from '@/components/Hoverable';

const Spinner = () => (
  <div className="spinner">
    <div className="bounce1"></div>
    <div className="bounce2"></div>
    <div className="bounce3"></div>
  </div>
);
class MessagePage extends PureComponent {
  state = {
    email: '',
    message: '',
    isSubmitting: false,
  };
  emailChange = ({target}) => {
    this.setState({email: target.value});
  };
  messageChange = ({target}) => {
    this.setState({message: target.value});
  };
  submit = e => {
    e.preventDefault();
    const {email, message, isSubmitting} = this.state;
    if (isSubmitting) {
      return;
    }
    this.setState({isSubmitting: true});
    const {lang} = this.props;
    const th = this;

    const xhr = new XMLHttpRequest();
    const payload = JSON.stringify({
      email,
      msg: message,
    });
    xhr.open('POST', MAIL_URL, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(payload);

    xhr.onload = function() {
      if (this.responseText === 'hop hop la la lei') {
        alert(dict.message_success[lang]);
        th.setState({
          email: '',
          message: '',
        });
      } else {
        alert(dict.message_fail[lang]);
      }
    };
    xhr.onerror = e => {
      alert(dict.message_fail[lang]);
    };
    xhr.onloadend = () => th.setState({isSubmitting: false});
  };
  render() {
    const {lang, theme} = this.props;
    const {email, message, isSubmitting} = this.state;
    const isDark = theme === 'light';
    return (
      <section className="message">
        <form onSubmit={this.submit} method="POST">
          <div className="message--form-sect">
            <label htmlFor="message_email">{dict.message_email[lang]}</label>
            <Hoverable>
              <input
                className={cn(
                  'email-input',
                  isDark && 'is-dark',
                  'theme-dependent',
                )}
                onChange={this.emailChange}
                type="email"
                id="message_email"
                value={email}
                required
                placeholder={dict.message_email[lang]}
              />
            </Hoverable>
          </div>
          <div className="message--form-sect">
            <label htmlFor="message_text">{dict.message_payload[lang]}</label>
            <Hoverable>
              <textarea
                required
                className={cn(
                  'message-input',
                  isDark && 'is-dark',
                  'theme-dependent',
                )}
                onChange={this.messageChange}
                id="message_text"
                value={message}
                placeholder={dict.message_payload[lang]}
              />
            </Hoverable>
          </div>
          {isSubmitting ? (
            <Spinner />
          ) : (
            <Hoverable style={{display: 'inline-block'}}>
              <button
                className={cn(isDark && 'is-dark', 'theme-dependent')}
                type="submit">
                {dict.message_send[lang]}
              </button>
            </Hoverable>
          )}
        </form>
      </section>
    );
  }
}

const mapState = ({lang, theme}) => ({
  lang,
  theme,
});
export default connect(mapState)(MessagePage);
