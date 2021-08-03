import Page from 'components/Page';
import React from 'react';
import {modalLoading} from '../docxtemplater/element'
import { Card, CardBody, CardHeader, Col, Row, Table, Button, Badge,
  Input, InputGroup, InputGroupAddon, InputGroupButton, FormGroup, Label, FormText,Modal,ModalBody } from 'reactstrap';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
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
class Slider extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      userid:null,
      password:null,
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
      id:null,

      oldUserID:'',
      u1:'',
      u2:'',
      u3:'',
      u4:'',

      validID:false,
      activePage: 1,
      itemPerPage:10,
      defaultPwd:'1234567890',
      isViewPwd:false,
      modal:false,

      judul:null,
      fileChooser:null,
      actionURL:null,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.timeout =  0;
  }

  componentDidMount(){
    this.loadData();
  }
  loadData(){
    this.setState({data:[],modal:true})
    const requestOptions = {
      method: 'POST',
      //headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userid: localStorage.getItem("user_session"), search: this.state.search })
    };
    fetch(process.env.REACT_APP_URL_API+'/rest/users.php', requestOptions)
        .then(response => response.json())
        .then(respon => {
          var dataAPI = respon;
          this.setState({modal:false})
          if(dataAPI.response_code != 200){
            this.setState({ message: dataAPI.message });
          }else{
            this.setState({ data: dataAPI.data, dataRender:dataAPI.data });
            this.handlePageChange(1)
          }
        });
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
        this.setState({ validID: false, u2: "" });
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

    if(this.state.isEdit){
     dt = { 
        id: this.state.id,
        name: document.getElementById("name").value,
        userid: document.getElementById("userid").value,
        email: document.getElementById("email").value,
        password: this.state.password,
      }
    }else{
      var name = document.getElementById("name").value;
      var userid = document.getElementById("userid").value;
      var password = md5(document.getElementById("password").value);

      if(name==''){
        this.setState({u1:'Harus diisi!'});
        return;
      }
      if(userid==''){
        this.setState({u2:'Harus diisi!'});
        return;
      }
      if(password==''){
        this.setState({u4:'Harus diisi!'});
        return;
      }
      if(!this.state.validID){
        return;
      }
      dt={ 
        name: name,
        userid: userid,
        email: document.getElementById("email").value,
        password: password,
      }
    }
    const requestOptions = {
      method: 'POST',
      //mode: 'cors', // no-cors, *cors, same-origin
      //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      //credentials: 'same-origin', // include, *same-origin, omit
      // headers: {
      //   'Content-Type': 'application/json',
      //   'Access-Control-Allow-Origin':'*',
      //   'mode': 'cors',
      //   // 'Content-Type': 'application/x-www-form-urlencoded',
      // },
      //redirect: 'follow', // manual, *follow, error
      //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url 
      //headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dt)
    };
    try{
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
        this.setState({isAdd:false, isEdit:false});
        this.loadData();
        this.resetField();
      }
    });}
    catch(er){
      console.log(er);
    }
  }
  resetField(){
    document.getElementById("judul").value = '';
    document.getElementById("fileChooser").value = '';
    document.getElementById("actionURL").value = '';
    this.setState({validID:false})
    //document.getElementById("password").value = '';
  }
  gotoEdit(idx){
    window.scrollTo(0,0);
    var data = this.state.data[idx];
    this.setState({
      isEdit:true, isAdd:true,id:data.id,password:data.password,oldUserID:data.userid
    })

    document.getElementById("judul").value = data.name;
    document.getElementById("userid").value = data.userid;
    document.getElementById("actionUrl").value = data.email;
    //document.getElementById("password").value = data.password;

  }
  deleteData(idx){
    var result = window.confirm("Apakah anda yakin ingin menghapus data?");
    if (result) {
      const requestOptions = {
        method: 'POST',
        //headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: this.state.data[idx].id })
      };
      fetch(process.env.REACT_APP_URL_API+'/rest/deleteUsers.php', requestOptions)
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
            message: 'Data Berhasil Dihapus!!',
            level: 'success',
          });
          var tbl = this.state.data;
          tbl.splice(idx,1);
          this.setState({data:tbl})
          this.loadData();
        }
      });
    }
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'file' ? target.files[0] : target.value;
    const key = target.name;

    //console.log(value);
    this.setState({
      [key]: value
    });

    if(key=="judul"){
      this.setState({u1:''});
    }
    if(key=="fileChooser"){
      this.setState({u2:''});
      //console.log();
      this.getFile(event.target.files[0]);
    }
  }
  getFile(file){
    var allowedFileTypes = ["image/png", "image/jpeg", "image/gif"];
    
    console.log("namafile: "+ file.name);
    
    if (allowedFileTypes.indexOf(file.type) > -1) {
      // file type matched is one of allowed file types. Do something here.
      var reader = new FileReader();
      var blob = new Blob([file], {
        type: file.type
      });
      reader.readAsDataURL(blob);
      reader.onloadend = function() {
        var base64data = reader.result;
        document.getElementById("viewer").src = base64data;
      }
      console.log("allowed");
    }else{
      console.log("not allowed");
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
    const {activePage, itemPerPage} = this.state;
    return (
      <Page
        title="Users"
        breadcrumbs={[{ name: 'Data Users', active: true }]}
        className="TablePage"
      >
        <NotificationSystem
          dismissible={false}
          ref={notificationSystem =>
            (this.notificationSystem = notificationSystem)
          }
          style={NOTIFICATION_SYSTEM_STYLE}
        />
        {modalLoading(this.state.modal)}
        <Row style={{display:this.state.isAdd?"block":"none"}}>
          <Col>
            <Card className="mb-3">
              <CardHeader className="d-flex justify-content-between">
                Tambah User
              </CardHeader>
              <CardBody>
                  <Row>
                    <Col xl={12} lg={12} md={12}>
                      <FormGroup row>
                        <Label for="judul" sm={3}>
                          Judul Slider
                        </Label>
                        <Col sm={6}>
                          <Input
                            //style={{height:'160px'}}
                            type="text"
                            name="judul"
                            id="judul"
                            placeholder="nama gambar slider"
                            onChange={this.handleInputChange}
                          />
                          <FormText color={'danger'}>{this.state.u1}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="file" sm={3}>
                          File
                        </Label>
                        <Col sm={6}>
                          {/* <Col sm={12}> */}
                          <Input
                            //style={{height:'160px'}}
                            valid={this.state.validID}
                            type="file"
                            name="fileChooser"
                            id="fileChooser"
                            placeholder="user id"
                            onChange={this.handleInputChange}
                            onKeyUp={()=>{this.cekUserID()}}
                          />
                          <FormText color={'danger'}>{this.state.u2}</FormText>
                          {/* </Col> */}
                          <br/>
                          <img id="viewer" 
                          style={{width:"150px",height:"240px"}}
                          src={''}
                          ></img>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label for="actionURL" sm={3}>
                         Action URL
                        </Label>
                        <Col sm={6}>
                          <Input
                            //style={{height:'160px'}}
                            type="text"
                            name="actionURL"
                            id="actionURL"
                            placeholder="(ex: https://facebook.com/sikarlia)"
                            onChange={this.handleInputChange}
                          />
                          <FormText color={'danger'}>{this.state.u3}</FormText>
                        </Col>
                      </FormGroup>
                    </Col>
                    <hr/>
                    <Col xl={12} lg={12} md={12}>
                      <FormGroup row className="d-flex justify-content-between">
                        &nbsp;
                        <Col sm={3}>
                          <Button color="danger" onClick={()=>{
                            this.setState({isAdd:false, isEdit:false});
                            this.resetField();
                          }}>Batal</Button> &nbsp;
                          <Button color="success" onClick={()=>{
                            this.addUser();
                            if(!this.state.isEdit){
                              //document.getElementById("password").value = '';
                            }
                          }}>Simpan</Button>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="mb-3">
              <CardHeader className="d-flex justify-content-between">
                <Button color="primary"
                  onClick={()=>{
                    this.setState({isAdd:true, isEdit:false});
                    document.getElementById("judul").value="";
                    document.getElementById("fileChooser").value="";
                    document.getElementById("actionURL").value="";
                  }}
                >
                  Tambah User
                </Button>
              <Col sm={3}>
                <InputGroup>
                  <Input 
                    name="search"
                    onKeyDown={this.handleKeyDown}
                    onChange={this.handleInputChange}
                    placeholder={"Search.."}/>
                  <InputGroupAddon addonType="append">
                    <Button color="primary" id="btnSearch"
                      onClick={()=>{this.loadData()}}
                    >
                      <MdSearch/>
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
              </CardHeader>
              <CardBody>
                <Table size="sm" responsive>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama</th>
                      <th>User ID</th>
                      <th>Email</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.dataRender.map((dt,index)=>(
                      <tr key={index}>
                        <td scope="row">{((activePage*itemPerPage)-itemPerPage) + index+1}</td>
                        <td>{dt.name}</td>
                        <td>{dt.userid}</td>
                        <td>{dt.email}</td>
                        <td>
                          <Button 
                            color="secondary"
                            onClick={()=>{this.gotoEdit(((activePage*itemPerPage)-itemPerPage) + index)}}
                            size="sm"
                          ><MdEdit/> Ubah</Button>&nbsp;                               
                          <Button 
                            style={{background:'rgb(230 14 20)', borderColor:'rgb(230 14 20)'}}
                            onClick={()=>{this.deleteData(((activePage*itemPerPage)-itemPerPage) + index)}}
                            size="sm"
                          ><MdDelete/> Delete</Button>                                
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row >
          <Col className="d-flex justify-content-between">
            &nbsp;
            <Pagination
              itemClass="page-item"
              linkClass="page-link"
              // hideNavigation={true}
              // hideFirstLastPages={true}
              activePage={this.state.activePage}
              itemsCountPerPage={this.state.itemPerPage}
              totalItemsCount={this.state.data.length}
              pageRangeDisplayed={5}
              onChange={this.handlePageChange.bind(this)}
            />
            &nbsp;
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
export default Slider;
