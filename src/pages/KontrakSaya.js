import Page from 'components/Page';
import React from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table, Button, Badge, FormGroup,
  Input, InputGroup, InputGroupAddon, InputGroupButton } from 'reactstrap';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import SearchInput from 'components/SearchInput';
import DocViewer from "react-doc-viewer";
import {generateDocument} from '../docxtemplater/engine';
import loadingImg from 'assets/img/logo/loading.gif';
import {getDefaultSetDataKontrak, modalLoading, getStatusKontrak, setupTgl} from '../docxtemplater/element';
import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import {
  MdDelete,MdCloudUpload,MdWarning,MdEdit,MdCheckCircle,MdSearch,MdPageview,MdDescription,MdClose,MdRefresh, MdSave, MdCheck
} from 'react-icons/md';
import Pagination from "react-js-pagination";
import Label from 'reactstrap/lib/Label';
import { charAtIndex } from 'pdf-lib';
const tableTypes = ['', 'bordered', 'striped', 'hover'];
// const docs = [
//   { uri:  },
//   //{ uri: window.location.origin+"/kontrak50_200.docx" }, // Local File
// ];
const fileMaster = {
  '50200PL-NonLS':'/kontrak50_200PL.docx',
  '50200NonPL-NonLS':'/kontrak50_200.docx',
  '200up-NonLS':'/kontrak200up.docx',
  '100PL-NonLS':'/kontrak50_200PL.docx',
  '100NonPL-NonLS':'/kontrak50_200.docx',
  '100up-NonLS':'/kontrak200up.docx',

  '50200PL-LS':'/kontrak50_200PL_LS.docx',
  '50200NonPL-LS':'/kontrak50_200_LS.docx',
  '200up-LS':'/kontrak200up_LS.docx',
  '100PL-LS':'/kontrak50_200PL_LS.docx',
  '100NonPL-LS':'/kontrak50_200_LS.docx',
  '100up-LS':'/kontrak200up_LS.docx',
}
class KontrakSaya extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      userid:null,
      usertype:localStorage.getItem("user_type"),
      password:false,
      data: [],
      dataToEdit:[],
      dataRender:[],
      datakontrak: {
        namaPekerjaan: null,
        suratPermintaanPPK: null
      },
      message:'',
      search:'',
      activePage: 1,
      itemPerPage: 10,
      modal:false,

      status:null,
      tipeKontrak:null,
      change:'-',
      create:'-',
      hrgtotal:0,
      namaPkj:'-',
      prshnPmn:'-',
      isPvw:false,
      dataToGenerate:[],
      choosedIdx:null,
      rows_test:[["Abc","","EFG","iaoh"]],
      cols_test:[{name: 'A', key: 0},{name: 'B', key: 1},{name: 'C', key: 2},{name: 'D', key: 3},{name: 'E', key: 4}],
      isFormInvalid: false,

      keyIframe: 0,
      urlIFrame: '',
      nmr:'',
      tgEdtNmr:true,
      yearFilter: localStorage.getItem("yearFilter"),
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount(){
    this.loadData();
    var url = '' 

    // console.log(url);
  }
  loadData(){
    const {usertype} = this.state;
    this.setState({data:[],modal:true})
    const requestOptions = {
      method: 'POST',
      //headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userid: localStorage.getItem("user_session"), 
                              usertype: usertype, search: this.state.search, 
                              yearFilter: this.state.yearFilter })
    };
    fetch(process.env.REACT_APP_URL_API+'/rest/viewKontrak.php', requestOptions)
        .then(response => response.json())
        .then(respon => {
          var dataAPI = respon;
          this.setState({modal:false});
          if(dataAPI.response_code != 200){
            this.setState({ message: dataAPI.message });
          }else{
            this.setState({ data: dataAPI.data, dataRender:dataAPI.data, dataToEdit: dataAPI.data });
            this.handlePageChange(1);
          }
        });
  }
  
  hitungTotal(dataKontrak, dataTabel){
    var subtot = 0;
    //console.log(tableHPS);
    // dataTabel.map((d)=>{
    //   subtot += parseInt(removeComma(d.total));
    // })
    //var subtot = 0;
    //console.log(tableHPS);
    //if(flag=="HPS"){
      dataTabel.tabel.map((d)=>{
        subtot += parseInt(removeComma(d.total));
      })
  
      var preppn = subtot * (0.1);
      var preMgmtFee = subtot * (dataKontrak.managementFeePctg/100);
      var mgmtFee = dataKontrak.isPctgMgmtFee == 1 ? preMgmtFee : parseInt(dataKontrak.mgmtFeeNmnl||0);
      var isMgt = dataKontrak.cb_managementFee==1?true:false;
      var isppn = dataKontrak.isPPN==1?true:false;
      var ppn = isMgt?(subtot+mgmtFee)*0.1:preppn;
      var hrgtotal = subtot + (isppn?ppn:0) + (isMgt?mgmtFee:0);
  
     
      dataKontrak.subtotalHPS = subtot;
      dataKontrak.ppnHPS = ppn;
      dataKontrak.hrgtotalHPS = hrgtotal;
      dataKontrak.managementFeeHPS = mgmtFee;
    //}else{
      var subtotHPS = 0;
      dataTabel.tabelPnw.map((d)=>{
        subtotHPS += parseInt(removeComma(d.total));
      })
  
      var preppn = subtotHPS * (0.1);
      var preMgmtFee = subtotHPS * (dataKontrak.managementFeePctgPnw/100);
      var mgmtFee = dataKontrak.isPctgMgmtFeePnw == 1 ? preMgmtFee : parseInt(dataKontrak.mgmtFeeNmnlPnw||0);
      //var mgmtFee = subtotHPS * (dataKontrak.managementFeePctgPnw/100);
      var isMgt = dataKontrak.cb_managementFeePnw==1?true:false;
      var isppn = dataKontrak.isPPNPnw==1?true:false;
      var ppn = isMgt?(subtotHPS+mgmtFee)*0.1:preppn;
      var hrgtotal = subtotHPS + (isppn?ppn:0) + (isMgt?mgmtFee:0);
  
     
      dataKontrak.subtotal = subtotHPS;
      dataKontrak.ppn = ppn;
      dataKontrak.hrgtotal = hrgtotal;
      dataKontrak.managementFee = mgmtFee;
    //}

    return dataKontrak;
  }
  
  preview(idx){
    window.scrollTo(0, 0);
    document.getElementById("viewer").src = '';
    var data = this.state.data[idx];

    
    data.hrgtotal = parseInt(data.hrgtotal||0);

    var status = getStatusKontrak(data.tipeKontrak, data);
    var tipe = getNamaTipeKontrak(data.tipeKontrak);
    this.setState({status:status,tipeKontrak:tipe,
      create:data.date_created,change:data.date_change||'-',
      hrgtotal:commafy(data.hrgtotal),
      namaPkj:data.namaPekerjaan,
      prshnPmn:data.namaPerusahaan||'-',
      choosedIdx:idx,
      nmr: data.nmr,
      LSorNon: data.LSorNon,
    })

    var cb_mgntFee = data.cb_managementFee;
    data.cb_managementFee = cb_mgntFee=="1"?true:false;

    //return;
    var sat = ["hari","minggu","bulan"];
    var indexSatPlkPkj = data.indexSatPlkPkj || 0;
    data.satPlkPkj = sat[indexSatPlkPkj];
    const requestOptions = {
      method: 'POST',
      //headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unique_id: data.unique_id })
    };
    fetch(process.env.REACT_APP_URL_API+'/rest/viewKontrakDetail.php', requestOptions)
        .then(response => response.json())
        .then(respon => {
          var dataAPI = respon;
          if(dataAPI.response_code == 200){
            console.log("DATA API DATA");
            console.log(dataAPI.data);
            data.TABEL = dataAPI.data.tabel;
            data.TABELPnw =  dataAPI.data.tabelPnw;
            data.TABELNego =  dataAPI.data.tabelNego;
            data.koordinator = dataAPI.data.tabelPdtKoor[0].nama;
            data.nipkoordinator = dataAPI.data.tabelPdtKoor[0].nip;
            data.PPK = dataAPI.data.tabelPdtPPK[0].nama;
            data.nipPPK = dataAPI.data.tabelPdtPPK[0].nip;
            data.PPBJ = dataAPI.data.tabelPdtPPBJ[0].nama;
            data.nipPPBJ = dataAPI.data.tabelPdtPPBJ[0].nip;

            data.jabatanKoor = dataAPI.data.tabelPdtKoor[0].jabatan;
            data.jabatanPPK = dataAPI.data.tabelPdtPPK[0].jabatan;
            
            data = this.hitungTotal(data,dataAPI.data);
          }
          else{
            data.TABEL = [];
            data.TABELPnw = [];
            data.TABELNego = [];
            data.subtotal = 0;
            data.ppn = 0;
            data.hrgtotal = 0;
            data.subtotalHPS = 0;
            data.ppnHPS = 0;
            data.hrgtotalHPS = 0;
            data.managementFeeHPS = 0;
            data.managementFee = 0;
          }
          data = setupTgl(data);
          console.log(data);
          this.setState({dataToGenerate:data});
          //console.log(data.tipeKontrak.concat("-",data.LSorNon));
          generateDocument(data,fileMaster[data.tipeKontrak.concat("-",data.LSorNon)],true);
          this.setState({
            urlIFrame: 'https://docs.google.com/viewer?url='+process.env.REACT_APP_URL_API+'/rest/previewDocx/'+localStorage.user_session+'.docx&embedded=true'
          })
        });
    
    return;
  }
  gotoEdit(idx){
    var data = this.state.dataToEdit[idx];
    var pathName = '';
    if(data.tipeKontrak=="100PL"){
      pathName = "/form100PL";
    }
    if(data.tipeKontrak=="100up"){
      pathName = "/form100up";
    }
    if(data.tipeKontrak=="100NonPL"){
      pathName = "/form100";
    }
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
  saveNomor(){
    var nmr = document.getElementById("inpNmr").value;
    var choosedIdx = this.state.data[this.state.choosedIdx].id;
    var t_dataToGenerate = this.state.dataToGenerate;
    this.setState({nmr: nmr, modal:true});
    const requestOptions = {
      method: 'POST',
      //headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userid: localStorage.getItem("user_session"), id: choosedIdx, nmr: nmr })
    };
    fetch(process.env.REACT_APP_URL_API+'/rest/updateNomorKontrak.php', requestOptions)
        .then(response => response.json())
        .then(respon => {
          var dataAPI = respon;
          this.setState({modal:false});
          if(dataAPI.response_code != 200){
            this.setState({ message: dataAPI.message });
          }else{
            t_dataToGenerate.nmr = nmr;
            this.setState({dataToGenerate: t_dataToGenerate});
            this.loadData();
          }
        });
  }
  render(){
    const {activePage, itemPerPage, usertype} = this.state;
    return (
      <Page
        title="Kontrak Saya"
        breadcrumbs={[{ name: 'Kontrak Saya', active: true }]}
        className="TablePage"
      >
        {modalLoading(this.state.modal)}
        <NotificationSystem
          dismissible={false}
          ref={notificationSystem =>
            (this.notificationSystem = notificationSystem)
          }
          style={NOTIFICATION_SYSTEM_STYLE}
        />
        <Row hidden={!this.state.isPvw}>
          <Col>
          <Card className="mb-3" >
            <CardHeader className="d-flex justify-content-between">Lihat Kontrak 
                <Button size="sm" color="danger"
                  onClick={()=>{this.setState({isPvw:!this.state.isPvw})}}
                ><MdClose/></Button></CardHeader>
            <CardBody>
              <Row>
                <Col xl={3} lg={12} md={12}>
                <Button 
                  style={{position:'absolute'}}
                  size = "sm"
                  onClick={()=>{
                    this.setState({keyIframe: this.state.keyIframe + 1});
                  }}
                ><MdRefresh/></Button>
                <iframe id="viewer" 
                  height="350px"
                  key={this.state.keyIframe}
                  src={
                    this.state.urlIFrame
                }
                >
                </iframe>
                </Col>
                <Col xl={9} lg={12} md={12}>
                  <Row>
                    <Label size="sm"sm={2} >Nama Pekerjaan</Label><Label size="sm">:</Label>
                    <Label size="sm"sm={9}>{this.state.namaPkj}</Label>
                  </Row>
                  <Row>
                    <Label size="sm"sm={2}>Perusahaan Pemenang</Label><Label size="sm">:</Label>
                    <Label size="sm"sm={3}>{this.state.prshnPmn}</Label>
                    <Label size="sm"sm={2}>Tipe Kontrak</Label><Label size="sm">:</Label>
                    <Label size="sm"sm={3}>{this.state.tipeKontrak}</Label>
                  </Row>
                  <Row>
                    <Label size="sm"sm={2}>Nilai Kontrak</Label><Label size="sm">:</Label>
                    <Label size="sm"sm={3}>{this.state.hrgtotal}</Label>
                    <Label size="sm"sm={2}>Tanggal Input</Label><Label size="sm">:</Label>
                    <Label size="sm"sm={3}>{this.state.create}</Label>
                  </Row>
                  <Row>
                    <Label size="sm"sm={2}>Nomor Kontrak</Label><Label size="sm">:</Label>
                    <Col sm={2} style={{display:(this.state.tgEdtNmr)?'block':'none'}}><Label size="sm">{this.state.nmr||"-"}</Label></Col>
                    <Col sm={2} style={{display:(this.state.tgEdtNmr)?'none':'block'}}><Input id="inpNmr" defaultValue={this.state.nmr} type="text"/></Col>
                    <Col sm={1}>
                      <Button title="Ubah Nomor Kontrak" 
                        style={{display:(this.state.tgEdtNmr)?'block':'none'}}
                        size="sm" onClick={()=>{this.setState({tgEdtNmr: !this.state.tgEdtNmr})}}><MdEdit/></Button>
                      <Button title="Simpan Nomor Kontrak" color="primary"
                        style={{display:(this.state.tgEdtNmr)?'none':'block'}}
                        size="sm" onClick={()=>{
                          this.setState({tgEdtNmr: !this.state.tgEdtNmr});
                          this.saveNomor();
                        }}><MdCheck/></Button>

                    </Col>
                    <Label size="sm"sm={2}>Tanggal Terakhir Diubah</Label><Label size="sm">:</Label>
                    <Label size="sm"sm={3}>{this.state.change}</Label>
                  </Row>
                  <Row>
                    <Label size="sm"sm={2}>Jenis Pengajuan</Label><Label size="sm">:</Label>
                    <Label size="sm"sm={3}>{this.state.LSorNon}</Label>
                    <Label size="sm"sm={2}>Status</Label><Label size="sm">:</Label>
                    <Label size="sm"sm={3}>{this.state.status}</Label>
                  </Row>
                  <Row>
                    <Col>
                      <Button size="sm" color="secondary"
                        hidden={usertype==2?false:true}
                        onClick={()=>{
                          var id = this.state.choosedIdx;
                          this.gotoEdit(id);
                        }}
                      > Ubah</Button>&nbsp;
                      <Button size="sm" color="success"
                        onClick={()=>{
                          var dt = this.state.dataToGenerate;
                          console.log(dt);
                          generateDocument(dt,fileMaster[dt.tipeKontrak.concat("-",dt.LSorNon)]);
                        }}
                      > Unduh DOCX</Button>
                    </Col>
                  </Row>
                </Col>
                
              </Row>
            </CardBody>
          </Card>
          </Col>
        </Row>
        {/* <OutTable data={this.state.rows_test} columns={this.state.cols_test} tableClassName="table table-sm" tableHeaderRowClass="table-responsive" /> */}
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
                <Table style={{fontSize:14}} size="sm" responsive {...{ ['' || 'default']: true }}>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th hidden={usertype==2? true:false}>User</th>
                      <th style={{width: "450px"}}>Nama Pekerjaan</th>
                      <th align="centre">Nilai Kontrak</th>
                      <th>Perusahaan Pemenang</th>
                      <th>Tipe Kontrak</th>
                      <th>Tanggal Input</th>
                      <th style={{width:"140px"}}>Action</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.dataRender.map((dt,index)=>(
                      <tr style={{backgroundColor:(index%2==0)?"#eff4fc":"#fff", height:60}} key={index}>
                        <td scope="row">{((activePage*itemPerPage)-itemPerPage) + index+1}</td>
                        <td hidden={usertype==2? true:false}>{dt.name}</td>
                        <td>{dt.namaPekerjaan}</td>
                        <td>{commafy(dt.hrgtotal)}</td>
                        <td>{dt.namaPerusahaan}</td>
                        <td>{getNamaTipeKontrak(dt.tipeKontrak)}</td>
                        <td>{dt.date_created}</td>
                        <td>
                          <Button 
                            title="Lihat Kontrak"
                            color="primary"
                            onClick={()=>{
                              this.preview(((activePage*itemPerPage)-itemPerPage) + index)
                              this.setState({isPvw:true})
                            }}
                            size="sm"
                          ><MdPageview/></Button>&nbsp;                               
                          <Button 
                            hidden={usertype==2?false:true}
                            title="Ubah Kontrak"
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
    return <div>
      <Badge color="link">Barang & Jasa Lainnya</Badge>
      <Badge title="Kontrak Barang & Jasa Lainnya dengan nilai antara 50 - 200 Juta Penunjukan Langsung" 
        color="info" pill className="mr-1">50-200 PL</Badge>
    </div>;
  }
  if(input=="50200NonPL"){
    return <div><Badge color="link">Barang & Jasa Lainnya</Badge><Badge title="Kontrak Barang & Jasa Lainnya dengan nilai 50 - 200 Juta" 
    color="success" pill className="mr-1">50-200</Badge></div>;
  }
  if(input=="200up"){
    return <div><Badge color="link">Barang & Jasa Lainnya</Badge><Badge title="Kontrak Barang & Jasa Lainnya dengan nilai diatas 200 Juta" 
    color="warning" pill className="mr-1">Diatas 200</Badge></div>;
  }
  if(input=="100up"){
    return <div><Badge color="link">Jasa Konsultasi</Badge><Badge title="Kontrak Jasa Konsultasi dengan nilai daiatas 100 Juta" 
    style={{backgroundColor:"blue"}} pill className="mr-1">Diatas 100</Badge></div>;
  }
  if(input=="100PL"){
    return <div><Badge color="link">Jasa Konsultasi</Badge><Badge title="Kontrak Jasa Konsultasi dengan nilai dibawah 100 Juta Penunjukan Langsung" 
    style={{backgroundColor:"darkmagenta"}} pill className="mr-1">Dibawah 100 PL</Badge></div>;
  }
  if(input=="100NonPL"){
    return <div><Badge color="link">Jasa Konsultasi</Badge><Badge title="Kontrak Jasa Konsultasi dengan nilai dibawah 100 Juta" 
    style={{backgroundColor:"tomato"}} pill className="mr-1">Dibawah 100</Badge></div>;
  }
}
function removeComma(num){
  return num.replace(/,/g, '');
}
export default KontrakSaya;
