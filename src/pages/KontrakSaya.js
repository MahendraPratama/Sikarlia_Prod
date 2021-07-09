import Page from 'components/Page';
import React from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table, Button, Badge,
  Input, InputGroup, InputGroupAddon, InputGroupButton } from 'reactstrap';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import SearchInput from 'components/SearchInput';
import {
  MdDelete,MdCloudUpload,MdWarning,MdEdit,MdCheckCircle,MdSearch,
} from 'react-icons/md';
import Pagination from "react-js-pagination";
const tableTypes = ['', 'bordered', 'striped', 'hover'];
class KontrakSaya extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      userid:null,
      password:false,
      data: [],
      dataRender:[],
      datakontrak: {
        namaPekerjaan: null,
        suratPermintaanPPK: null
      },
      message:'',
      search:'',
      activePage: 1,
      itemPerPage: 10,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount(){
    this.loadData();
  }
  loadData(){
    this.setState({data:[]})
    const requestOptions = {
      method: 'POST',
      //headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userid: localStorage.getItem("user_session"), search: this.state.search })
    };
    fetch(process.env.REACT_APP_URL_API+'/rest/viewKontrak.php', requestOptions)
        .then(response => response.json())
        .then(respon => {
          var dataAPI = respon;
          if(dataAPI.response_code != 200){
            this.setState({ message: dataAPI.message });
          }else{
            this.setState({ data: dataAPI.data, dataRender:dataAPI.data });
            this.handlePageChange(1)
          }
        });
  }
  gotoEdit(idx){
    var data = this.state.data[idx];
    var pathName = '';
    if(data.tipeKontrak=="50200PL"){
      pathName = "/form50200PL";
    }
    if(data.tipeKontrak=="200up"){
      pathName = "/form200up";
    }
    if(data.tipeKontrak=="50200NonPL"){
      pathName = "/form50200";
    }
    this.props.history.push({
      pathname: pathName,
      data : data
    })
  }
  deleteData(idx){
    var result = window.confirm("Apakah anda yakin ingin menghapus data?");
    if (result) {
      const requestOptions = {
        method: 'POST',
        //headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unique_id: this.state.data[idx].unique_id })
      };
      fetch(process.env.REACT_APP_URL_API+'/rest/deleteKontrak.php', requestOptions)
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
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const key = target.name;

    console.log(value);
    this.setState({
      [key]: value
    })
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
        title="Kontrak Saya"
        breadcrumbs={[{ name: 'Kontrak Saya', active: true }]}
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
              <CardHeader className="d-flex justify-content-between">&nbsp;
              <Col sm={3}>
                <InputGroup>
                  <Input 
                    name="search"
                    onKeyDown={this.handleKeyDown}
                    onChange={this.handleInputChange}
                    placeholder={"Search.."}/>
                  <InputGroupAddon addonType="append">
                    <Button id="btnSearch"
                      onClick={()=>{this.loadData()}}
                    >
                      <MdSearch/>
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
              </CardHeader>
              <CardBody>
                <Table responsive {...{ ['hover' || 'default']: true }}>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th style={{width: "450px"}}>Nama Pekerjaan</th>
                      <th>Nilai Kontrak</th>
                      <th>Perusahaan Pemenang</th>
                      <th>Tipe Kontrak</th>
                      <th>Tanggal Input</th>
                      <th style={{width:"95px"}}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.dataRender.map((dt,index)=>(
                      <tr key={index}>
                        <td scope="row">{((activePage*itemPerPage)-itemPerPage) + index+1}</td>
                        <td>{dt.namaPekerjaan}</td>
                        <td>{commafy(dt.hrgtotal)}</td>
                        <td>{dt.namaPerusahaan}</td>
                        <td>{getNamaTipeKontrak(dt.tipeKontrak)}</td>
                        <td>{dt.date_created}</td>
                        <td>
                          <Button 
                            title="Edit Kontrak"
                            color="secondary"
                            onClick={()=>{this.gotoEdit(((activePage*itemPerPage)-itemPerPage) + index)}}
                            size="sm"
                          ><MdEdit/></Button>&nbsp;                               
                          <Button 
                            title="Hapus Kontrak"
                            style={{background:'rgb(230 14 20)', borderColor:'rgb(230 14 20)'}}
                            onClick={()=>{this.deleteData(((activePage*itemPerPage)-itemPerPage) + index)}}
                            size="sm"
                          ><MdDelete/></Button>                                
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
    return <Badge title="Kontrak dengan nilai antara 50 - 200 Juta Penunjukan Langsung" color="info" pill className="mr-1">50-200 PL</Badge>;
  }
  if(input=="50200NonPL"){
    return <Badge title="Kontrak dengan nilai 50 - 200 Juta" color="success" pill className="mr-1">50-200</Badge>;
  }
  if(input=="200up"){
    return <Badge title="Kontrak dengan nilai daiatas 200 Juta" color="warning" pill className="mr-1">Diatas 200</Badge>;
  }
}
export default KontrakSaya;
