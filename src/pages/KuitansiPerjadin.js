import Page from 'components/Page';
import React from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table, Button, Badge, FormGroup, FormText,
  Input, InputGroup, InputGroupAddon, InputGroupButton } from 'reactstrap';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import SearchInput from 'components/SearchInput';
import DocViewer from "react-doc-viewer";
import {generateDocument, generateKwtPerjadin} from '../docxtemplater/engine';
import loadingImg from 'assets/img/logo/loading.gif';
import {getDefaultSetDataKontrak, modalLoading, getStatusKontrak, setupTgl} from '../docxtemplater/element';
import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import NumberFormat from 'react-number-format';
import {
  MdDelete,MdFeaturedPlayList,MdWarning,MdEdit,MdCheckCircle,MdSearch,MdLibraryAdd,MdAddBox,MdClose, MdFileDownload, MdCheck, MdClear,
  MdSave,
  MdDone,
  MdCloudDone,
} from 'react-icons/md';
import Pagination from "react-js-pagination";
import Label from 'reactstrap/lib/Label';
const tableTypes = ['', 'bordered', 'striped', 'hover'];
// const docs = [
//   { uri:  },
//   //{ uri: window.location.origin+"/kontrak50_200.docx" }, // Local File
// ];
const fileMaster = {
  '50200PL':'/kontrak50_200PL.docx',
  '50200NonPL':'/kontrak50_200.docx',
  '200up':'/kontrak200up.docx',
  '100PL':'/kontrak50_200PL.docx',
  '100NonPL':'/kontrak50_200.docx',
  '100up':'/kontrak200up.docx',
}
var dataPeg = [];
var dataPerjadin = [];
class KuitansiPerjadin extends React.Component {
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

      namaPenerima:'',
      hideChooser:true,
      dataPegawai:[],
      dataRenderPerjadin:[],
      editNominal:false,
      inputBaru:false,
      isEdit:false,
      editedID:'',
      editedUID:'',
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
      body: JSON.stringify({ userid: localStorage.getItem("user_session"), usertype: usertype, search: this.state.search })
    };
    fetch(process.env.REACT_APP_URL_API+'/rest/viewPerjadin.php', requestOptions)
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
  handleSrcPegawai(){
    const requestOptions = {
      method: 'POST',
      //headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({namaPegawai: this.state.namaPenerima})
    };
    fetch(process.env.REACT_APP_URL_API+'/rest/lookupDataPegawai.php', requestOptions)
    .then(response => response.json())
    .then(respon => {
        this.setState({dataPegawai: respon.data, hideChooser:false})
        //console.log(this.state.dataPerusahaan)
    });
  }
  renderChooserPegawai(){
    var data = this.state.dataPegawai;
    
    if(!data){
        //this.setState({hideChooser:true})
      return null;
    }

    var datalen = this.state.dataPegawai.length;
    var options = [];
    for(var i = 0; i < datalen; i++){
      options.push(<option key={i}>{data[i].nama} | {data[i].nip}</option>)
    }
    return (
      <Input 
        hidden={this.state.hideChooser}
        type="select" name="chooserDataPemenang" 
        id="chooser" multiple 
        onClick={()=>{
          var idx = document.getElementById('chooser').selectedIndex;
          //console.log(document.getElementById('chooser').selectedIndex)
          this.setState({hideChooser:true, msg_p1:'', msg_p2:'', msg_p3:'', msg_p4:''});
          var dtChoosed = this.state.dataPegawai[idx];
          document.getElementById('namaPenerima').value = dtChoosed.nama;
          document.getElementById('nip').value = dtChoosed.nip;
          
          dataPeg.id   = dtChoosed.id;
          dataPeg.nama = dtChoosed.nama;
          dataPeg.nip  = dtChoosed.nip;
        }}
      >
        {options}
      </Input>
    )
  }
  addPegawai(){
      var nmPeg = document.getElementById('namaPenerima').value;
      var nip = document.getElementById('nip').value;
      var nominal = document.getElementById('nominal').value;
      var idpeg;
      if(nmPeg==""){
        this.sendErrorNotif("Harap isi Nama Penerima terlebih dahulu");
        return;
      }
      if(this.state.dataPegawai!=null && !dataPeg.id){
        this.sendErrorNotif("Pilih salah satu dari database");
        return;
      }
    //   if(nip==""){
    //     this.sendErrorNotif("Harap isi NIP Penerima terlebih dahulu");
    //     return;
    //   }
      
      
      if(!dataPeg.id){
        const requestOptions = {
            method: 'POST',
            //headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({userid:"",nama: nmPeg, nip:nip})
          };
          fetch(process.env.REACT_APP_URL_API+'/rest/insertPegawai.php', requestOptions)
          .then(response => response.json())
          .then(respon => {
              var row = {
                id: respon.data,
                nama: nmPeg,
                nip: nip,
                nominal: this.state.nominal
            }
            dataPerjadin.push(row);
            this.setState({nominal:'', dataRenderPerjadin: dataPerjadin})
          });
      }else{
        var row = {
            id: dataPeg.id,
            nama: nmPeg,
            nip: nip,
            nominal: this.state.nominal
        }
        dataPerjadin.push(row);
        this.setState({nominal:'', dataRenderPerjadin: dataPerjadin})
      }
      
      console.log(dataPerjadin);
      dataPeg = [];
      document.getElementById('namaPenerima').value = "";
      document.getElementById('nip').value = "";
      document.getElementById('nominal').value = "";
      
  }
  simpanKuitansi(){
    var nmKeg = document.getElementById('namaKegiatan').value;    
    var tglKeg = document.getElementById('tglKegiatan').value;    
    var asal = document.getElementById('asal').value;    
    var tujuan = document.getElementById('tujuan').value;    
    if(nmKeg==""){
      this.sendErrorNotif("Harap isi Nama Kegiatan terlebih dahulu");
      return;
    }
    if(tglKeg==""){
        this.sendErrorNotif("Harap isi Tanggal Kegiatan terlebih dahulu");
        return;
    }
    if(asal==""){
    this.sendErrorNotif("Harap isi Kota Asal terlebih dahulu");
    return;
    }
    if(tujuan==""){
    this.sendErrorNotif("Harap isi Kota Tujuan terlebih dahulu");
    return;
    }

    var body = {
        userid: localStorage.getItem("user_session"),
        namaKegiatan: nmKeg,
        tglKegiatan: tglKeg,
        asal: asal,
        tujuan: tujuan,
        TABEL: dataPerjadin
    }
    if(this.state.isEdit){
        body.id = this.state.editedID;
        body.unique_id = this.state.editedUID;
    }
    const requestOptions = {
        method: 'POST',
        //headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      };
      fetch(process.env.REACT_APP_URL_API+'/rest/insertPerjadin.php', requestOptions)
      .then(response => response.json())
      .then(respon => {
          if(respon.response_code==200){
            this.setState({inputBaru:false});
            this.notificationSystem.addNotification({
                title: <MdCloudDone />,
                message: "Data berhasil disimpan",
                level: 'success',
              });
            this.loadData();
            var dtHead = {
                nama_kegiatan: nmKeg, tgl_kegiatan: tglKeg, asal:asal, tujuan: tujuan
            }
            var dtBody = dataPerjadin;
            var dt = {head: dtHead, body: dtBody};
            generateKwtPerjadin(dt, "/Template_Perjadin.docx");
          }else{
            this.sendErrorNotif(respon.message)
          }
      });
  }
  downloadKwt(idx){
      var dtHead = this.state.dataRender[idx];
      var dtBody = [];

      const requestOptions = {
        method: 'POST',
        //headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userid:'', unique_id: dtHead.unique_id})
      };
      fetch(process.env.REACT_APP_URL_API+'/rest/getDetailPerjadin.php', requestOptions)
      .then(response => response.json())
      .then(respon => {
          if(respon.response_code==200){
            var dt = {head: dtHead, body: respon.data};
            generateKwtPerjadin(dt, "/Template_Perjadin.docx");
          }else{
            this.sendErrorNotif(respon.message)
          }
      });
      
  }
  gotoEdit(idx){
    this.setState({isEdit: true, inputBaru: true})
    var dtHead = this.state.dataRender[idx];
    document.getElementById('namaKegiatan').value = dtHead.nama_kegiatan;    
    document.getElementById('tglKegiatan').value = dtHead.tgl_kegiatan;    
    document.getElementById('asal').value = dtHead.asal;    
    document.getElementById('tujuan').value = dtHead.tujuan;
    
    this.setState({editedID: dtHead.id, editedUID: dtHead.unique_id});
    const requestOptions = {
        method: 'POST',
        //headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userid:'', unique_id: dtHead.unique_id})
      };
      fetch(process.env.REACT_APP_URL_API+'/rest/getDetailPerjadin.php', requestOptions)
      .then(response => response.json())
      .then(respon => {
          if(respon.response_code==200){
            dataPerjadin = respon.data;
            this.setState({dataRenderPerjadin: dataPerjadin})
          }else{
            this.sendErrorNotif(respon.message)
          }
      });
    
  }
  deleteData(idx){
    var result = window.confirm("Apakah anda yakin ingin menghapus data?");
    if (result) {
      const requestOptions = {
        method: 'POST',
        //headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unique_id: this.state.dataRender[idx].unique_id })
      };
      fetch(process.env.REACT_APP_URL_API+'/rest/deletePerjadin.php', requestOptions)
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
          this.loadData();
        }
      });
    }
  }
  render(){
    const {activePage, itemPerPage, usertype} = this.state;
    return (
      <Page
        title="Kuitansi GU"
        breadcrumbs={[{ name: 'Kuitansi GU', active: true }]}
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
        <Row hidden={!this.state.inputBaru}>
          <Col>
          <Card className="mb-3" >
            <CardHeader className="d-flex justify-content-between">Input Data 
                <Button size="sm" color="danger"
                  onClick={()=>{this.setState({inputBaru:false});}}
                ><MdClose/></Button></CardHeader>
            <CardBody>
                <Row>
                    <Col xl={12} lg={12} md={12}>
                        <FormGroup row>
                        <Label for="namaKegiatan" sm={3}>
                          Nama Kegiatan
                        </Label>
                        <Col sm={9}>
                          <Input
                            style={{height:'160px'}}
                            type="textarea"
                            name="namaKegiatan"
                            id="namaKegiatan"
                            placeholder="cth: Rapat Pembahasan KAK HPS Kegiatan Literasi Digital"
                            onChange={this.handleInputChange}
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="tglKegiatan" sm={3}>
                          Tanggal Kegiatan
                        </Label>
                        <Col sm={7}>
                          <Input
                            type="text"
                            name="tglKegiatan"
                            id="tglKegiatan"
                            placeholder="cth: 10 Januari 2022 / 10-12 Januari 2022"
                            onChange={this.handleInputChange}
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="asal" sm={3}>
                          Asal
                        </Label>
                        <Col sm={5}>
                          <Input
                            type="text"
                            name="asal"
                            id="asal"
                            placeholder="cth: Jakarta"
                            onChange={this.handleInputChange}
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="tujuan" sm={3}>
                          Tujuan
                        </Label>
                        <Col sm={5}>
                          <Input
                            type="text"
                            name="tujuan"
                            id="tujuan"
                            placeholder="cth: Depok"
                            onChange={this.handleInputChange}
                          />
                        </Col>
                      </FormGroup>
                        <Label for="namaPenerima" sm={3}>
                            <MdLibraryAdd/> Input Penerima Perjadin
                        </Label>
                      <hr/>
                      <FormGroup row>
                        <Label for="namaPenerima" sm={3}>
                          Nama Penerima
                        </Label>
                        <Col sm={7}>
                          <Input
                            type="text"
                            name="namaPenerima"
                            id="namaPenerima"
                            placeholder="nama penerima"
                            onChange={this.handleInputChange}
                            onKeyUp={()=>{this.handleSrcPegawai()}}
                          />
                          {this.renderChooserPegawai()}
                          <Label style={{fontSize:10}}>ket: jika tidak muncul pilihan maka akan ditambahkan sebagai data baru</Label>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="nip" sm={3}>
                          NIP
                        </Label>
                        <Col sm={7}>
                          <Input
                            type="text"
                            name="nip"
                            id="nip"
                            placeholder="nip penerima perjadin"
                            onChange={this.handleInputChange}
                          />
                          <FormText color={'danger'}>{this.state.msg_p5}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="nominal" sm={3}>
                          Jumlah Uang
                        </Label>
                        <Col sm={3}>
                            <NumberFormat
                            className="form-control"
                            id={"nominal"} name={"nominal"}
                            thousandSeparator={true} 
                            prefix={'Rp. '} 
                            value={this.state.nominal}
                            onValueChange={(values) => {
                                const { formattedValue, value } = values;
                                this.setState({ nominal: value });
                            }}
                            />
                          <FormText color={'danger'}>{this.state.msg_p3}</FormText>
                        </Col>
                      </FormGroup>
                      <Col className="d-flex justify-content-between">
                        &nbsp;<Button sm color="secondary" onClick={()=>{this.addPegawai()}}><MdAddBox/>&nbsp;&nbsp;Add</Button>
                      </Col>
                        <Label for="namaPenerima" sm={3}>
                            <MdFeaturedPlayList/> Daftar Penerima Perjadin
                        </Label>
                      <hr/>
                      <Table style={{fontSize:14}} size="sm" responsive {...{ ['' || 'default']: true }}>
                        <thead>
                            <tr>
                            <th>No</th>
                            <th>Nama Penerima</th>
                            <th>NIP</th>
                            <th>Nominal</th>
                            <th style={{width:"140px"}}>Action</th>
                            
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.dataRenderPerjadin.map((dt,index)=>(
                            <tr style={{backgroundColor:(index%2==0)?"#eff4fc":"#fff", height:60}} key={index}>
                                <td scope="row">{index+1}</td>
                                <td>{dt.nama}</td>
                                <td>{dt.nip}</td>
                                <td style={{width:250}}>
                                    <NumberFormat
                                        className="form-control"
                                        id={"nominal"} name={"nominal"}
                                        thousandSeparator={true} 
                                        prefix={'Rp. '} 
                                        value={dt.nominal==undefined?'':dt.nominal}
                                        onValueChange={(values) => {
                                            const { formattedValue, value } = values;
                                            dataPerjadin[index].nominal = value;
                                            this.setState({ dataRenderPerjadin: dataPerjadin, editNominal: true });
                                        }}
                                    />
                                    
                                </td>
                                <td>                                                           
                                <Button 
                                    title="Hapus Kuitansi"
                                    style={{background:'rgb(230 14 20)', borderColor:'rgb(230 14 20)'}}
                                    onClick={()=>{
                                        dataPerjadin.splice(index,1);
                                        this.setState({dataRenderPerjadin:dataPerjadin})
                                    }}
                                    size="sm"
                                ><MdDelete/></Button>                                
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </Table>
                        <Col className="d-flex justify-content-between">
                            &nbsp;<Button sm color="success" onClick={()=>{this.simpanKuitansi()}}><MdSave/>&nbsp;&nbsp;Simpan</Button>
                        </Col>
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
              <CardHeader className="d-flex justify-content-between">
                <Button
                    title="Buat Kuitansi Baru"
                    color="secondary"
                    onClick={()=>{
                        this.setState({inputBaru:true, isEdit: false});
                    }}
                    size="sm"
                ><MdLibraryAdd/> Input Baru</Button>
                &nbsp;
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
                      <th>Nama Kegiatan</th>
                      <th>Tanggal Kegiatan</th>
                      <th>Asal</th>
                      <th>Tujuan</th>
                      <th>Tanggal Input</th>
                      <th style={{width:"140px"}}>Action</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.dataRender.map((dt,index)=>(
                      <tr style={{backgroundColor:(index%2==0)?"#eff4fc":"#fff", height:60}} key={index}>
                        <td scope="row">{((activePage*itemPerPage)-itemPerPage) + index+1}</td>
                        <td>{dt.nama_kegiatan}</td>
                        <td>{dt.tgl_kegiatan}</td>
                        <td>{dt.asal}</td>
                        <td>{dt.tujuan}</td>
                        <td>{dt.date_created}</td>
                        <td>
                          <Button 
                            title="Unduh Kuitansi"
                            color="success"
                            onClick={()=>{
                              this.downloadKwt(((activePage*itemPerPage)-itemPerPage) + index)
                              //this.setState({isPvw:true})
                            }}
                            size="sm"
                          ><MdFileDownload/></Button>&nbsp;                               
                          <Button 
                            hidden={usertype==2?false:true}
                            title="Ubah Kuitansi"
                            color="secondary"
                            onClick={()=>{this.gotoEdit(((activePage*itemPerPage)-itemPerPage) + index)}}
                            size="sm"
                          ><MdEdit/></Button>&nbsp;                               
                          <Button 
                            title="Hapus Kuitansi"
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
  sendErrorNotif(msg){
    this.notificationSystem.addNotification({
        title: <MdWarning />,
        message: msg,
        level: 'error',
      });
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
export default KuitansiPerjadin;
