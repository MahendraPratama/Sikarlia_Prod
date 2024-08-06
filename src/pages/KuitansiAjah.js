import Page from 'components/Page';
import React from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table, Button, Badge, FormGroup, FormText,
  Input, InputGroup, InputGroupAddon, InputGroupButton } from 'reactstrap';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import SearchInput from 'components/SearchInput';
import DocViewer from "react-doc-viewer";
import {generateDocument, generateKwtPerjadin, generateKuitansiKeplek} from '../docxtemplater/engine';
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

const ttdDef = "data:image/jpeg;base64,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AQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAGQyGQcjH40+mou1adQAUUUUAFFFFABRRQaACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKazqp5PXpTqguXxMuOTjlc0AT0VHFceZ1+VumKkFAAzbR/8AWpiMS5+Vunen0UAFFI7bEJ9KSOTeTwRj1oAdRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAU07gxJ27eo9adQw3DBoAb5oz/nijzVFHlrnpQYlI6UAKrb1yKWhV2jiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Z";
var dataPeg = [];
var dataPerjadin = [];
var dataKuitansi = [];

var pdtKoordinator = [];
var pdtPPK = [];

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
      dataPerusahaan:[],
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount(){
    this.loadData();
    var url = '' 

    pdtKoordinator = JSON.parse(localStorage.getItem("pdtKoordinator"));
    pdtPPK = JSON.parse(localStorage.getItem("pdtPPK"));

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

    dataKuitansi[target.name] = value;

    if(target.type=="file"){
      this.setState({[key]:''});
      this.getFile(event.target.files[0],key);
    }
    console.log(value);
    this.setState({
      [key]: value
    })
  }
  getFile(file,keyname){
    var allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];
    
    //console.log("namafile: "+ file.name);
    if(file==undefined){
      return;
    }
    
    if (allowedFileTypes.indexOf(file.type) > -1) {
      // file type matched is one of allowed file types. Do something here.
      var reader = new FileReader();
      var blob = new Blob([file], {
        type: file.type
      });
      reader.readAsDataURL(blob);
      reader.onloadend = function() {
        var base64data = reader.result;
        //document.getElementById("viewerHPS").src = base64data;
        var img = document.getElementById('viewttd'); 
        img.src = base64data;
        // setTimeout(()=>{
        //   var width = img.naturalWidth;
        //   var height = img.naturalHeight;
        //   dataKontrak[keyname+"W"] = width;
        //   dataKontrak[keyname+"H"] = height;
        //   console.log("allowed : " +width+","+height);
        // },500)
        console.log(base64data)
        //dataKontrak["base64"+keyname.replace("img","")] = base64data;
      }
      
    }else{
      console.log("not allowed");
      this.setState({[keyname]:'format file tidak diijinkan'});
      document.getElementById('viewttd').src = ttdDef;
    }
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
        console.log(respon.data)
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
          document.getElementById('viewttd').src = dtChoosed.base64ttd==null?ttdDef:dtChoosed.base64ttd;
          
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
                nominal: this.state.nominal,
                base64ttd: document.getElementById('viewttd').src
            }
            dataPerjadin.push(row);
            this.setState({nominal:'', dataRenderPerjadin: dataPerjadin})
          });
      }else{
        var row = {
            id: dataPeg.id,
            nama: nmPeg,
            nip: nip,
            nominal: this.state.nominal,
            base64ttd: document.getElementById('viewttd').src
        }
        const requestOptions = {
          method: 'POST',
          //headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({userid:"",
              id: dataPeg.id,
              nama: nmPeg,
              nip: nip,
              nominal: this.state.nominal,
              base64ttd: document.getElementById('viewttd').src})
        };
        console.log(requestOptions);
        fetch(process.env.REACT_APP_URL_API+'/rest/insertPegawai.php', requestOptions)
          .then(response => response.json());
        dataPerjadin.push(row);
        this.setState({nominal:'', dataRenderPerjadin: dataPerjadin})
      }
      
      console.log(dataPerjadin);
      dataPeg = [];
      document.getElementById('namaPenerima').value = "";
      document.getElementById('nip').value = "";
      document.getElementById('nominal').value = "";
      document.getElementById('viewttd').src = ttdDef;
      
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

  generateKuitansi(){
    console.log(dataKuitansi);
    generateKuitansiKeplek(dataKuitansi, "/TEMPLATE_KUITANSI_LENGKAP.docx");
  }
  handleSearchPerusahaan(){
    const requestOptions = {
      method: 'POST',
      //headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({namaPerusahaan: dataKuitansi.namaPerusahaan})
    };
    fetch(process.env.REACT_APP_URL_API+'/rest/lookupDataPerusahaan.php', requestOptions)
    .then(response => response.json())
    .then(respon => {
        this.setState({dataPerusahaan: respon.data, hideChooser:false})
        //console.log(this.state.dataPerusahaan)
    });
  }
  renderChooserDataPerusahaan(){
    var data = this.state.dataPerusahaan;
    
    if(!data){
      return null;
    }

    var datalen = this.state.dataPerusahaan.length;
    var options = [];
    for(var i = 0; i < datalen; i++){
      options.push(<option key={i}>{data[i].namaPerusahaan}, {data[i].namaDirektur}</option>)
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
          var dtChoosed = this.state.dataPerusahaan[idx];
          document.getElementById('namaPerusahaan').value = dtChoosed.namaPerusahaan;
          document.getElementById('alamatPerusahaan').value = dtChoosed.alamatPerusahaan;
          document.getElementById('namaDirektur').value = dtChoosed.namaDirektur;
          document.getElementById('jabatan').value = dtChoosed.jabatan;
          document.getElementById('npwpPerusahaan').value = dtChoosed.npwpPerusahaan;
          // document.getElementById('namaRek').value = dtChoosed.namaRek;
          // document.getElementById('noRek').value = dtChoosed.noRek;
          // document.getElementById('bankRek').value = dtChoosed.bankRek;

          dataKuitansi.namaPerusahaan    = dtChoosed.namaPerusahaan;
          dataKuitansi.alamatPerusahaan  = dtChoosed.alamatPerusahaan;
          dataKuitansi.namaDirektur      = dtChoosed.namaDirektur;
          dataKuitansi.jabatan           = dtChoosed.jabatan;
          dataKuitansi.npwpPerusahaan    = dtChoosed.npwpPerusahaan;
          // dataKuitansi.namaRek           = dtChoosed.namaRek;
          // dataKuitansi.noRek             = dtChoosed.noRek;
          // dataKuitansi.bankRek           = dtChoosed.bankRek;
        }}
      >
        {options}
      </Input>
    )
  }


  renderChooserKoordinator(){
    var data = pdtKoordinator;
    
    if(!data){
      return null;
    }
    var datalen = data.length;
    var options = [];

    for(var i = 0; i < datalen; i++){
      options.push(<option key={i} value={data[i].id} selected={data[i].id==dataKuitansi.pdtKoordinator?true:false}>{data[i].nama} | {data[i].nip}</option>)
    }
    return (
      <Input 
        //hidden={this.state.hideChooser}
        type="select" name="chooserKoordinator" 
        id="chooserKoordinator" 
        onClick={()=>{
          var idx = document.getElementById('chooserKoordinator').selectedIndex;
          //console.log(document.getElementById('chooser').selectedIndex)
          //this.setState({hideChooser:true, msg_p1:'', msg_p2:'', msg_p3:'', msg_p4:''});
          var dtChoosed = data[idx];
          console.log(dtChoosed);

          dataKuitansi.pdtKoordinator    = dtChoosed.id;
          dataKuitansi.koordinator    = dtChoosed.nama;
          dataKuitansi.nipkoordinator    = dtChoosed.nip;
          dataKuitansi.jabatanKoor    = dtChoosed.jabatan;
          this.setState({msg_p1: ''});
        }}
      >
        {options}
      </Input>
    )
  }
  

  renderChooserPPK(){
    var data = pdtPPK;
    
    if(!data){
      return null;
    }
    var datalen = data.length;
    var options = [];
    for(var i = 0; i < datalen; i++){
      options.push(<option key={i} value={data[i].id} selected={data[i].id==dataKuitansi.pdtPPK?true:false}>{data[i].nama} | {data[i].nip}</option>)
    }
    return (
      <Input 
        //hidden={this.state.hideChooser}
        type="select" name="chooserPPK" 
        id="chooserPPK" 
        onClick={()=>{
          var idx = document.getElementById('chooserPPK').selectedIndex;
          //console.log(document.getElementById('chooser').selectedIndex)
          //this.setState({hideChooser:true, msg_p1:'', msg_p2:'', msg_p3:'', msg_p4:''});
          var dtChoosed = data[idx];

          dataKuitansi.pdtPPK    = dtChoosed.id;
          dataKuitansi.PPK    = dtChoosed.nama;
          dataKuitansi.nipPPK    = dtChoosed.nip;
          dataKuitansi.jabatanPPK = dtChoosed.jabatan;
          this.setState({msg_p1: ''});
        }}
      >
        {options}
      </Input>
    )
  }

  render(){
    const {activePage, itemPerPage, usertype} = this.state;
    return (
      <Page
        title="Kuitansi dibawah 50 Juta"
        breadcrumbs={[{ name: 'Kuitansi dibawah 50 Juta', active: true }]}
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
        {/* <Row hidden={!this.state.inputBaru}> */}
        <Row> 
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
                        <Label sm={2}>
                          Nama Pekerjaan
                        </Label>
                        <Col sm={7}>
                          <Input
                            style={{height:'160px'}}
                            type="textarea"
                            name="namaPekerjaan"
                            id="namaPekerjaan"
                            placeholder=""
                            onChange={this.handleInputChange}
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="nmrSpc" sm={2}>
                          Nomor Surat Pemesanan
                        </Label>
                        <Col sm={4}>
                          <Input
                            type="text"
                            name="nmrSpc"
                            id="nmrSpc"
                            
                            onChange={this.handleInputChange}
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="tglPemesanan" sm={2}>
                          Tanggal Pemesanan
                        </Label>
                        <Col sm={4}>
                          <Input
                            type="date"
                            name="tglPemesanan"
                            id="tglPemesanan"
                            
                            onChange={this.handleInputChange}
                          />
                          <span style={{fontSize:10}}>Tanggal Pemesanan dibuat 2 hari sebelum pelaksanaan Kegiatan. PERHATIKAN JANGAN PILIH TANGGAL MERAH</span>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="tglPembayaran" sm={2}>
                          Tanggal Pembayaran
                        </Label>
                        <Col sm={4}>
                          <Input
                            type="date"
                            name="tglPembayaran"
                            id="tglPembayaran"
                            
                            onChange={this.handleInputChange}
                          />
                          <span style={{fontSize:10}}>Tanggal Pemesanan dibuat 7 hari/lebih setelah pelaksanaan Kegiatan. PERHATIKAN JANGAN PILIH TANGGAL MERAH</span>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="" sm={2}>
                          Nominal Kuitansi
                        </Label>
                        <Col sm={4}>
                          <NumberFormat
                            className="form-control"
                            id={"hrgtotal"} name={"hrgtotal"}
                            thousandSeparator={true} 
                            prefix={'Rp. '} 
                            value={this.state.hrgtotal}
                            onValueChange={(values) => {
                                const { formattedValue, value } = values;
                                dataKuitansi.hrgtotal = value;
                                this.setState({ hrgtotal: value });
                            }}
                            />
                        </Col>
                      </FormGroup>
                      <hr/>
                      <FormGroup row>
                        <Label for="namaPerusahaan" sm={2}>
                          Nama Perusahaan
                        </Label>
                        <Col sm={7}>
                          <Input
                            type="text"
                            name="namaPerusahaan"
                            id="namaPerusahaan"
                            placeholder="nama perusahaan"
                            onChange={this.handleInputChange}
                            onKeyUp={()=>{this.handleSearchPerusahaan()}}
                          />
                          <FormText color={'danger'}>{this.state.msg_p1}</FormText>
                          {this.renderChooserDataPerusahaan()}
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="alamatPerusahaan" sm={2}>
                          Alamat Perusahaan
                        </Label>
                        <Col sm={7}>
                          <Input
                            style={{height:'160px'}}
                            type="textarea"
                            name="alamatPerusahaan"
                            id="alamatPerusahaan"
                            placeholder="alamat perusahaan"
                            onChange={this.handleInputChange}
                          />
                          <FormText color={'danger'}>{this.state.msg_p2}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="namaDirektur" sm={2}>
                          Nama Penandatangan
                        </Label>
                        <Col sm={4}>
                          <Input
                            type="text"
                            name="namaDirektur"
                            id="namaDirektur"
                            placeholder="nama penandatangan"
                            onChange={this.handleInputChange}
                          />
                          <FormText color={'danger'}>{this.state.msg_p3}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="jabatan" sm={2}>
                          Jabatan
                        </Label>
                        <Col sm={4}>
                          <Input
                            type="text"
                            name="jabatan"
                            id="jabatan"
                            placeholder="jabatan penandatangan"
                            onChange={this.handleInputChange}
                          />
                          <FormText color={'danger'}>{this.state.msg_p5}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="npwpPerusahaan" sm={2}>
                          NPWP
                        </Label>
                        <Col sm={4}>
                          <Input
                            type="text"
                            name="npwpPerusahaan"
                            id="npwpPerusahaan"
                            placeholder="npwp"
                            onChange={this.handleInputChange}
                            //maxLength="5"
                          />
                          <FormText color={'danger'}>{this.state.msg_p4}</FormText>
                        </Col>
                      </FormGroup>
                      <hr/>
                      <FormGroup row>
                        <Label for="hrgtotalPNW" sm={2}>
                          Koordinator
                        </Label>
                        <Col sm={4}>
                        {this.renderChooserKoordinator()}
                          <FormText color={'danger'}>{this.state.msg_p1}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="hrgtotal" sm={2}>
                          PPK
                        </Label>
                        <Col sm={4}>
                        {this.renderChooserPPK()}
                          <FormText color={'danger'}>{this.state.msg_p1}</FormText>
                        </Col>
                      </FormGroup>

                        <Col className="d-flex justify-content-between">
                            &nbsp;<Button sm color="success" onClick={()=>{this.generateKuitansi()}}><MdSave/>&nbsp;&nbsp;DOWNLOAD</Button>
                        </Col>
                    </Col>
                  </Row>
                </CardBody>
          </Card>
          </Col>
        </Row>
        {/* <OutTable data={this.state.rows_test} columns={this.state.cols_test} tableClassName="table table-sm" tableHeaderRowClass="table-responsive" /> */}
        <Row hidden={true}>
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
        <Row hidden={true}>
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
