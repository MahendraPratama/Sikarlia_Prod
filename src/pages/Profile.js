import Page from 'components/Page';
import React from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table, Button, Badge,
  Input, InputGroup, InputGroupAddon, InputGroupButton, FormGroup, Label, FormText } from 'reactstrap';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import SearchInput from 'components/SearchInput';
import {
  MdDelete,MdCloudUpload,MdWarning,MdEdit,MdCheckCircle,MdSearch,MdRemoveRedEye,MdVisibility,MdVisibilityOff
} from 'react-icons/md';
import Pagination from "react-js-pagination";
import ButtonGroup from 'reactstrap/lib/ButtonGroup';
import md5 from 'md5';
//require("bootstrap/less/bootstrap.less");
const tableTypes = ['', 'bordered', 'striped', 'hover'];
function hasWhiteSpace(s) {
  return /\s/g.test(s);
}
class Profile extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      userid:null,
      password:localStorage.password,
      data: [],
      dataRender:[],
      datakontrak: {
        namaPekerjaan: null,
        suratPermintaanPPK: null
      },
      message:'',
      search:'',
      isAdd:false,
      isEdit:false,
      id:localStorage.id,

      oldUserID:localStorage.user_session,
      u1:'',
      u2:'',
      u3:'',
      u4:'',

      validID:true,
      activePage: 1,
      itemPerPage:5,
      defaultPwd:'1234567890',
      isViewPwd:false,
      isChangePwd:false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.timeout =  0;
  }

  componentDidMount(){
    this.loadData();
  }
  loadData(){
    document.getElementById("name").value = localStorage.user_name;
    document.getElementById("userid").value = localStorage.user_session;
    document.getElementById("email").value = localStorage.email;
    this.setState({password:localStorage.password,u1:'',u2:'',u3:'',u4:''});
  }
  resetPassword(){
    var dt = { 
      id: this.state.id,
      name: document.getElementById("name").value,
      userid: document.getElementById("userid").value,
      email: document.getElementById("email").value,
      password: md5(this.state.defaultPwd),
    };
    const requestOptions = {
      method: 'POST',
      //headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dt)
    };
    fetch(process.env.REACT_APP_URL_API+'/rest/insertUsers.php', requestOptions)
    .then(response => response.json())
    .then(respon => {
      var dataAPI = respon;
      if(dataAPI.response_code != 200){
        //this.setState({ message: dataAPI.message });
        this.notificationSystem.addNotification({
          title: <MdWarning />,
          message: dataAPI.message,
          level: 'error',
        });
      }else{
        //this.setState({ data: dataAPI.data });
        this.notificationSystem.addNotification({
          title: <MdCheckCircle />,
          message: 'Password Berhasil Direset!!',
          level: 'success',
        });
        this.setState({isAdd:false,isEdit:false})
        this.loadData();
        this.resetField();
      }
    });
  }
  cekUserID(){
    if(this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if(hasWhiteSpace(this.state.userid)){
        this.setState({ validID: false, u2: "userid tidak boleh mengandung spasi" });
        return;
      }
      if(this.state.userid==''){
        this.setState({ validID: false, u2: "Harus diisi!" });
        return;
      }
      if(this.state.isEdit && this.state.oldUserID == this.state.userid){
        this.setState({ validID: true, u2: "" });
        return;
      }
      const requestOptions = {
        method: 'POST',
        //headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userid: this.state.userid })
      };
      fetch(process.env.REACT_APP_URL_API+'/rest/cekUserID.php', requestOptions)
          .then(response => response.json())
          .then(respon => {
            var dataAPI = respon;
            if(dataAPI.response_code != 200){
              this.setState({ validID: false, u2: dataAPI.message });
            }else{
              this.setState({ validID: true, u2: '' });
            }
          });
    }, 400);
  }
  addUser(){
    var dt = {};

    if(!this.state.validID){
      if(userid==''){
        this.setState({u2:'Harus diisi!'});
        return;
      }
      return;
    }
    if(name==''){
      this.setState({u1:'Harus diisi!'});
      return;
    }
    if(userid==''){
      this.setState({u2:'Harus diisi!'});
      return;
    }

    if(this.state.isChangePwd===false){
     dt = { 
        id: this.state.id,
        name: document.getElementById("name").value,
        userid: document.getElementById("userid").value,
        email: document.getElementById("email").value,
        password: localStorage.password,
      }
    }else{
      var name = document.getElementById("name").value;
      var userid = document.getElementById("userid").value;
      var password = md5(document.getElementById("password").value);

      
      if(password==''){
        this.setState({u4:'Harus diisi!'});
        return;
      }
      
      dt={ 
        id: this.state.id,
        name: name,
        userid: userid,
        email: document.getElementById("email").value,
        password: password,
      }
    }

    const requestOptions = {
      method: 'POST',
      //headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dt)
    };
    fetch(process.env.REACT_APP_URL_API+'/rest/insertUsers.php', requestOptions)
    .then(response => response.json())
    .then(respon => {
      var dataAPI = respon;
      if(dataAPI.response_code != 200){
        //this.setState({ message: dataAPI.message });
        this.notificationSystem.addNotification({
          title: <MdWarning />,
          message: dataAPI.message,
          level: 'error',
        });
      }else{
        //this.setState({ data: dataAPI.data });
        this.notificationSystem.addNotification({
          title: <MdCheckCircle />,
          message: 'Data Berhasil Disimpan!!',
          level: 'success',
        });
        localStorage.clear();
        window.location.href = "/";
      }
    });
  }
  resetField(){
    document.getElementById("name").value = '';
    document.getElementById("userid").value = '';
    document.getElementById("email").value = '';
    this.setState({validID:false})
    //document.getElementById("password").value = '';
  }

  
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const key = target.name;

    //console.log(value);
    this.setState({
      [key]: value
    });

    if(key=="name"){
      this.setState({u1:''});
    }
    if(key=="userid"){
      this.setState({u2:''});
    }
    if(key=="password"){
      this.setState({u4:''});
    }
  }

  handleKeyDown(event){
    if(event.keyCode === 13){
      event.preventDefault();
      console.log(this.state.search)
      this.loadData();
    }
  }
  render(){
    const {activePage, itemPerPage, isEdit, isChangePwd} = this.state;
    return (
      <Page
        title="Profile"
        breadcrumbs={[{ name: 'User Profile', active: true }]}
        className="TablePage"
      >
        <NotificationSystem
          dismissible={false}
          ref={notificationSystem =>
            (this.notificationSystem = notificationSystem)
          }
          style={NOTIFICATION_SYSTEM_STYLE}
        />
        <Row>
          <Col>
            <Card className="mb-3">
              <CardHeader className="d-flex justify-content-between">
                Profile
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xl={12} lg={12} md={12}>
                    <FormGroup row>
                      <Label for="name" sm={3}>
                        Nama User
                      </Label>
                      <Col sm={6}>
                        <Input
                          readOnly={isEdit?false:true}
                          //style={{height:'160px'}}
                          type="text"
                          name="name"
                          id="name"
                          placeholder="nama user"
                          onChange={this.handleInputChange}
                        />
                        <FormText color={'danger'}>{this.state.u1}</FormText>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="userid" sm={3}>
                        User ID
                      </Label>
                      <Col sm={6}>
                        <Input
                          readOnly={isEdit?false:true}
                          //style={{height:'160px'}}
                          valid={this.state.validID}
                          type="text"
                          name="userid"
                          id="userid"
                          placeholder="user id"
                          onChange={this.handleInputChange}
                          onKeyUp={()=>{this.cekUserID()}}
                        />
                        <FormText color={'danger'}>{this.state.u2}</FormText>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="email" sm={3}>
                        Email
                      </Label>
                      <Col sm={6}>
                        <Input
                          readOnly={isEdit?false:true}
                          type="email"
                          name="email"
                          id="email"
                          placeholder="email"
                          onChange={this.handleInputChange}
                        />
                        <FormText color={'danger'}>{this.state.u3}</FormText>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="password" sm={3}>
                        Password
                      </Label>
                      {isEdit?
                      <Col sm={6}>
                        {isChangePwd?
                          <div>
                            <InputGroup>
                              <Input sm={4}
                                //style={{height:'160px'}}
                                type={this.state.isViewPwd?"text":"password"}
                                name="password"
                                id="password"
                                placeholder="new password"
                                onChange={this.handleInputChange}
                              />
                              <InputGroupAddon addonType="append">
                                  <Button 
                                    onClick={()=>{
                                      var oldState = this.state.isViewPwd;
                                      this.setState({isViewPwd:!oldState});
                                    }}
                                    outline={this.state.isViewPwd?true:false}>
                                    {this.state.isViewPwd?<MdVisibilityOff/>:<MdVisibility/>}</Button>
                              </InputGroupAddon>
                            </InputGroup>
                            <Button color="link" size="sm" onClick={()=>{
                              var oldState = this.state.isChangePwd;
                              this.setState({isChangePwd:!oldState});
                            }}>Cancel</Button>
                          <FormText color={'danger'}>{this.state.u4}</FormText>
                        </div>
                        :
                        <div>
                        *****************&nbsp;
                        <Button color="link" size="sm" onClick={()=>{
                          var oldState = this.state.isChangePwd;
                          this.setState({isChangePwd:!oldState});
                        }}>Change Password</Button>
                        </div>
                        }
                        
                      </Col>:
                      <Col>*****************</Col>
                      }
                    </FormGroup>
                  </Col>
                  <hr/>
                  <Col xl={12} lg={12} md={12}>
                    <FormGroup row className="d-flex justify-content-between">
                      &nbsp;
                      {localStorage.getItem("user_type")==2?
                      (isEdit?
                      <Col sm={3}>
                        <Button color="danger" onClick={()=>{
                          this.setState({isEdit:false});
                          //this.resetField();
                          this.loadData();
                        }}>Cancel</Button> &nbsp;
                        <Button color="success" onClick={()=>{
                          this.addUser();
                        }}>Simpan</Button>
                      </Col>
                        :
                      <Col sm={3}>
                        <Button
                          onClick={()=>{
                            this.setState({isEdit:true})
                          }}
                        >Edit</Button>
                      </Col>
                      )
                      :
                      null}
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            
            </Card>
          </Col>
        </Row>       
      </Page>
    );
  }
  handlePageChange(pageNumber) {
    // console.log(`active page is ${pageNumber}`);
    var x = this.state.itemPerPage;
    var dataAll = this.state.data;
    var dtRender = dataAll.slice((pageNumber*x)-x,pageNumber*x)
    this.setState({activePage: pageNumber, dataRender: dtRender});
  }
}

function commafy( num ) {
  var str = num.toString().split('.');
  if (str[0].length >= 5) {
      str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
  if (str[1] && str[1].length >= 5) {
      str[1] = str[1].replace(/(\d{3})/g, '$1 ');
  }
  return str.join('.');
}

function getNamaTipeKontrak(input){
  if(input=="50200PL"){
    return <Badge color="info" pill className="mr-1">50-200 PL</Badge>;
  }
  if(input=="50200NonPL"){
    return <Badge color="success" pill className="mr-1">50-200</Badge>;
  }
  if(input=="200up"){
    return <Badge color="warning" pill className="mr-1">Diatas 200</Badge>;
  }
}
export default Profile;
