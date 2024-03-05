import logo200Image from 'assets/img/logo/logo_login_baru.png';
import PropTypes from 'prop-types';
import {modalLoading} from '../docxtemplater/element'
import React from 'react';
import { Button, Form, FormGroup, Input, Label, InputGroupAddon, InputGroup, Modal, ModalBody,ModalFooter,ModalHeader } from 'reactstrap';
import { Redirect, withRouter } from 'react-router-dom';
import md5 from 'md5';
import {
  MdDelete,MdCloudUpload,MdWarning,MdEdit,MdCheckCircle,MdSearch,MdRemoveRedEye,MdVisibilityOff,MdVisibility
} from 'react-icons/md';
//var {queries} = require('../server/query').default;
class AuthForm extends React.Component {
  constructor(props){
    super(props)
    this.state = {
        userid:null,
        password:false,
        data: null,
        message: null,
        isViewPwd:false,
        modal:false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  get isLogin() {
    return this.props.authState === STATE_LOGIN;
  }

  get isSignup() {
    return this.props.authState === STATE_SIGNUP;
  }

  componentDidMount() {
    this.getPenandatangan();
    if (localStorage.getItem("user_session"))
      window.location.href = "/dashboard"
  }
  getPenandatangan(){
    var newDate = new Date();
    const ro1 = {
      method: 'POST',
      //headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: "Koordinator", year: newDate.getFullYear() })
    };
    fetch(process.env.REACT_APP_URL_API+'/rest/lookupPdt.php', ro1)
        .then(response => response.json())
        .then(respon => {
          var dataAPI = respon;
          this.setState({modal:false});
          if(dataAPI.response_code != 200){
            this.setState({ message: dataAPI.message });
          }else{
            localStorage.setItem("pdtKoordinator", JSON.stringify(dataAPI.data));
            //this.setState({ pdtKoordinator : dataAPI});
          }
        });

    const ro2 = {
      method: 'POST',
      //headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: "PPBJ", year: newDate.getFullYear() })
    };
    fetch(process.env.REACT_APP_URL_API+'/rest/lookupPdt.php', ro2)
        .then(response => response.json())
        .then(respon => {
          var dataAPI = respon;
          this.setState({modal:false});
          if(dataAPI.response_code != 200){
            this.setState({ message: dataAPI.message });
          }else{
            localStorage.setItem("pdtPPBJ", JSON.stringify(dataAPI.data));
            //this.setState({ pdtPPBJ : dataAPI});
          }
        });

    const ro3 = {
      method: 'POST',
      //headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: "PPK", year: newDate.getFullYear() })
    };
    fetch(process.env.REACT_APP_URL_API+'/rest/lookupPdt.php', ro3)
        .then(response => response.json())
        .then(respon => {
          var dataAPI = respon;
          this.setState({modal:false});
          if(dataAPI.response_code != 200){
            this.setState({ message: dataAPI.message });
          }else{
            localStorage.setItem("pdtPPK", JSON.stringify(dataAPI.data));
            //this.setState({ pdtPPK : dataAPI});
          }
        });
  }
  changeAuthState = authState => event => {
    event.preventDefault();

    this.props.onChangeAuthState(authState);
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const key = target.name;

    this.setState({
      [target.name]: value
    });
  }
  handleKeyDown(event){
    if(event.keyCode === 13){
      event.preventDefault();
      //console.log(this.state.search)
      this.handleSubmit(event);
    }
  }
  handleSubmit = event => {
    event.preventDefault();
    this.setState({modal:true})
    const userid = this.state.userid;
    const password = this.state.password;

    var IsLogin = false;
    //console.log(userid + ", " + password)
    const requestOptions = {
      method: 'POST',
      // headers: { 'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin':'*',
      // 'access-control-allow-headers':'Authorization, Content-Type' },
      body: JSON.stringify({ userid: userid, password: md5(password) })
    };
    fetch(process.env.REACT_APP_URL_API+'/rest/login.php', requestOptions)
        .then(response => response.json())
        .then(respon => {
          var dataAPI = respon;
          if(dataAPI.response_code != 200){
            this.setState({ message: dataAPI.message });
          }else{
            localStorage.setItem("user_session", dataAPI.data.userid);
            localStorage.setItem("user_name", dataAPI.data.name);
            localStorage.setItem("user_type", dataAPI.data.user_type);
            localStorage.setItem("id", dataAPI.data.id);
            localStorage.setItem("password", dataAPI.data.password);
            localStorage.setItem("email", dataAPI.data.email);
            var newDate = new Date();
            localStorage.setItem("yearFilter", newDate.getFullYear());

            var now = newDate.getTime();
            
            localStorage.setItem('setupTime', now);
            IsLogin = true;
            //window.location.href = "/dashboard";
            //return <Redirect to="/dashboard" />
          }})
          .then(()=>{
            //console.log(IsLogin);
            this.setState({modal:false})
            if(IsLogin){
              //this.props.history = window.location.origin;
              this.props.history.push('/dashboard');
            }
            
          });

    
    //console.log(queries.getUsers());
    //
    //


  };

  renderButtonText() {
    const { buttonText } = this.props;

    if (!buttonText && this.isLogin) {
      return 'Login';
    }

    if (!buttonText && this.isSignup) {
      return 'Signup';
    }

    return buttonText;
  }

  render() {
    const {
      showLogo,
      usernameLabel,
      usernameInputProps,
      passwordLabel,
      passwordInputProps,
      confirmPasswordLabel,
      confirmPasswordInputProps,
      children,
      onLogoClick,
    } = this.props;

    return (
      <Form 
      //className="bg-main-sikocak"
      onSubmit={this.handleSubmit}>
        {showLogo && (
          <div className="text-center pb-4">
            <img
              src={logo200Image}
              className="rounded"
              style={{ width: '50%', height: '50%', cursor: 'pointer' }}
              alt="logo"
              onClick={onLogoClick}
            />
          </div>
        )}
        <div className="text-center pt-1">
          {/* <h2>SiKarlia</h2> */}
          {/* <h6>Aplikasi Kotrak Cepat</h6> */}
        </div>
        <br/>
        <p style={{color:'red'}}>{this.state.message}</p>
        <hr/>
        {modalLoading(this.state.modal)}
        <FormGroup>
          <Label for={usernameLabel}>{usernameLabel}</Label>
          <Input name="userid" onChange={this.handleInputChange} {...usernameInputProps} onKeyDown={this.handleKeyDown} />
        </FormGroup>
        <FormGroup>
          <Label for={passwordLabel}>{passwordLabel}</Label>
          <InputGroup>
            <Input 
              type={this.state.isViewPwd?"text":"password"}
              name="password" 
              placeholder="your password"
              onChange={this.handleInputChange}
              onKeyDown={this.handleKeyDown} />
            <InputGroupAddon addonType="append">
              <Button 
                onClick={()=>{
                  var oldState = this.state.isViewPwd;
                  this.setState({isViewPwd:!oldState});
                }}
                color="primary"
                outline={this.state.isViewPwd?true:false}>
                {this.state.isViewPwd?<MdVisibilityOff/>:<MdVisibility/>}</Button>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>
        {this.isSignup && (
          <FormGroup>
            <Label for={confirmPasswordLabel}>{confirmPasswordLabel}</Label>
            <Input {...confirmPasswordInputProps} />
          </FormGroup>
        )}
        {/* <FormGroup check>
          <Label check>
            <Input type="checkbox" />{' '}
            {this.isSignup ? 'Agree the terms and policy' : 'Remember me'}
          </Label>
        </FormGroup> */}
        <hr />
        <Button
          size="lg"
          color="primary"
          //className="btn btn-info bg-main-sikocak"
          block
          id="loginBtn"
          onClick={this.handleSubmit}>
          {this.renderButtonText()}
        </Button>

        {/* <div className="text-center pt-1">
          <h6>or</h6>
          <h6>
            {this.isSignup ? (
              <a href="#login" onClick={this.changeAuthState(STATE_LOGIN)}>
                Login
              </a>
            ) : (
              <a href="#signup" onClick={this.changeAuthState(STATE_SIGNUP)}>
                Signup
              </a>
            )}
          </h6>
        </div> */}

        {children}
      </Form>
    );
  }
}

export const STATE_LOGIN = 'LOGIN';
export const STATE_SIGNUP = 'SIGNUP';

AuthForm.propTypes = {
  authState: PropTypes.oneOf([STATE_LOGIN, STATE_SIGNUP]).isRequired,
  showLogo: PropTypes.bool,
  usernameLabel: PropTypes.string,
  usernameInputProps: PropTypes.object,
  passwordLabel: PropTypes.string,
  passwordInputProps: PropTypes.object,
  confirmPasswordLabel: PropTypes.string,
  confirmPasswordInputProps: PropTypes.object,
  onLogoClick: PropTypes.func,
};

AuthForm.defaultProps = {
  authState: 'LOGIN',
  showLogo: true,
  usernameLabel: 'User ID',
  usernameInputProps: {
    type: 'text',
    placeholder: 'your user id',

  },
  passwordLabel: 'Password',
  passwordInputProps: {
    type: 'password',
    placeholder: 'your password',
  },
  confirmPasswordLabel: 'Confirm Password',
  confirmPasswordInputProps: {
    type: 'password',
    placeholder: 'confirm your password',
  },
  onLogoClick: () => {},
};

export default withRouter(AuthForm);
