import Page from 'components/Page';
import React from 'react';
import {generateDocument} from '../docxtemplater/engine';
import {reSatPlkPkjChooser, getDefaultSetDataKontrak, autoBAPP, reMgmtFeeChooser} from '../docxtemplater/element';
import {pushKontrak} from '../server/API';
import { Stepper, Step } from 'react-form-stepper';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import Base64String from 'lz-string';
import NumberFormat from 'react-number-format';
import {
  MdDelete,MdCloudUpload,MdWarning,MdEdit,MdInfo, MdAdd
} from 'react-icons/md';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormFeedback,
  FormGroup, InputGroup, InputGroupAddon,
  FormText,
  Input,
  Label,
  Row,
  Table,
} from 'reactstrap';
import { fstat } from 'fs';
var tableHPS = [];
var tablePnwrn = [];
var tblPenampung = [];
var pdtKoordinator = [];
var pdtPPBJ = [];
var pdtPPK = [];
const urlFile= 'https://drive.google.com/u/0/uc?id=15uCHB-w4Xhz-pQAqwBzcil3AoRZB7f6U&export=download';
const path = window.location.origin  + '/kontrak50_200.docx';
const urlLocal = 'https://localhost/docxtemplate/kontrak50_200.docx';
var dataKontrak = [];
var dataNegosiasi = [{uraianNego:"",hasilNego:"Ada perubahan harga, semula Rp xxx.xxx,- menjadi Rp. xxx.xxx,-"}];
class Form50200 extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      togleLS:true,
      dtProps: [
        {tipe:'50200NonPL',name:'Barang & Jasa Lainnya / Kontrak 50 - 200 Juta', filename:'/kontrak50_200_test.docx'},
        {tipe:'100NonPL',name:'Jasa Konsultasi / Kontrak dibawah 100 Juta', filename:'/kontrak50_200_test.docx'},
        {tipe:'50200PL',name:'Barang & Jasa Lainnya / Kontrak 50 - 200 Juta Penunjukan Langsung', filename:'/kontrak50_200PL.docx'},
        {tipe:'100PL',name:'Jasa Konsultasi / Kontrak dibawah 100 Juta Penunjukan Langsung', filename:'/kontrak50_200PL.docx'},
        {tipe:'200up',name:'Barang & Jasa Lainnya / Kontrak diatas 200 Juta', filename:'/kontrak200up.docx'},
        {tipe:'100up',name:'Jasa Konsultasi / Kontrak diatas 100 Juta', filename:'/kontrak200up.docx'},
      ],
        nameFile:'',
        userid:null,
        password:false,
        data: null,
        datakontrak: {
          namaPekerjaan: null,
          suratPermintaanPPK: null
        },
        step:[
          'block',
          'none',
          'none',
          'none',
          'none',
          'none',
          'none',
        ],
        stateBtnSave:'',
        message_step1: '',
        message_step1: '',
        message_step1_2:'',
        activeStep:1,
        msg_j1:'',
        msg_j2:'',
        msg_j3:'',
        msg_j4:'',
        msg_j5:'',
        msg_j6:'',
        msg_j7:'',
        msg_j8:'',
        msg_j9:'',
        msg_j10:'',
        msg_j11:'',
        msg_j12:'',
        msg_j13:'',
        msg_j14:'',

        j2:false,
        j3:false,
        j4:false,
        j5:false,
        j6:false,
        j7:false,
        j8:false,
        j9:false,
        j10:false,
        j11:false,
        j12:false,
        j13:false,
        j14:false,

        msg_tb1:'',
        msg_tb2:'',
        msg_tb3:'',
        msg_tb4:'',
        msg_tb5:'',
        TABEL:[],
        TABELPnw:[],

        subtotal:0,
        ppn:0,
        managementFee:0,
        hrgtotal:0,
        hrgtotalPNW:0,

        msg_p1:'',
        msg_p2:'',
        msg_p3:'',
        msg_p4:'',

        validasiJadwal:false,
        dataPerusahaan:[],
        dataRenderNegosiasi:[{uraianNego:"", hasilNego:"Ada perubahan harga, semula Rp xxx.xxx,- menjadi Rp. xxx.xxx,-"}],
        hideChooser: true,
        isManagementFee:false,
        isPPN:true,
        isPPNPnw:true,

        isEditHPS:false,
        isEditPnw:false,

        indexEditHPS:null,
        indexEditPnw:null,
        tglKosong:'0000-00-00',
        indexSatPlkPkj:0,
        tipe:'',
        isHPSimg:false,
        isPenawaranimg:false,
        isPctgMgmtFee:0,
        isPctgMgmtFeePnw:0,
        overNilai:false,

        toglehidePmb:true,
        yearFilter: localStorage.getItem("yearFilter"),
    };
    //this.handleNext = this.handleNext.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  getBreadcrumbs(type){
    var dt = this.state.dtProps;
    var slc = dt.filter(x=>x.tipe==type);
    
    return slc[0].name
  }
  hidePembanding(type){
    if(type=='50200NonPL'||type=='100NonPL'){
      return 'block';
    }else{
      return 'none';
    }
  }
  hideOptional(type){
    return type?'none':'block';
  }
  isUp200(){
    return this.props.tipe=="100up"||this.props.tipe=='200up'?true:false;
  }
  getnameFile(){
    var type = this.props.tipe;
    var dt = this.state.dtProps;
    var slc = dt.filter(x=>x.tipe==type);
    return slc[0].filename;
  }
  componentWillUnmount(){
    dataKontrak = getDefaultSetDataKontrak(this.props.tipe);
    tableHPS = [];
    tablePnwrn = [];
  }
  componentDidMount(){
    
    tableHPS = [];
    tablePnwrn = [];
    pdtKoordinator = JSON.parse(localStorage.getItem("pdtKoordinator"));
    pdtPPK = JSON.parse(localStorage.getItem("pdtPPK"));
    pdtPPBJ = JSON.parse(localStorage.getItem("pdtPPBJ"));
    
    this.setState({tipe:this.props.tipe});
    dataKontrak = getDefaultSetDataKontrak(this.props.tipe);
    //this.getPenandatangan();
    const {data} = this.props.location;
    if(!data){
      return;
    }
    console.log(data);
    dataKontrak.id                    = data.id
    dataKontrak.unique_id             = data.unique_id
    dataKontrak.namaPekerjaan         = data.namaPekerjaan
    dataKontrak.suratPermintaanPPK    = data.suratPermintaanPPK //!='0000-00-00' ? data.suratPermintaanPPK : null
    dataKontrak.pengadaanBarJas       = data.pengadaanBarJas //!='0000-00-00' ? data.pengadaanBarJas : null
    dataKontrak.HPS                   = data.HPS //!='0000-00-00' ? data.HPS : null
    dataKontrak.penawaranRKS          = data.penawaranRKS //!='0000-00-00' ? data.penawaranRKS : null
    dataKontrak.pengajuanPenawaran    = data.pengajuanPenawaran //!='0000-00-00' ? data.pengajuanPenawaran : null
    dataKontrak.undanganEvaluasi      = data.undanganEvaluasi //!='0000-00-00' ? data.undanganEvaluasi : null
    dataKontrak.evaluasi              = data.evaluasi //!='0000-00-00' ? data.evaluasi : null
    dataKontrak.penetapanPenyedia     = data.penetapanPenyedia //!='0000-00-00' ? data.penetapanPenyedia : null
    dataKontrak.laporanPelaksanaan    = data.laporanPelaksanaan //!='0000-00-00' ? data.laporanPelaksanaan : null
    dataKontrak.suratPemesanan        = data.suratPemesanan //!='0000-00-00' ? data.suratPemesanan : null
    dataKontrak.penandatangananKontrak= data.penandatangananKontrak //!='0000-00-00' ? data.penandatangananKontrak : null
    dataKontrak.pelaksanaanPekerjaan  = data.pelaksanaanPekerjaan
    dataKontrak.penyelesaianPekerjaan = data.penyelesaianPekerjaan //!='0000-00-00' ? data.penyelesaianPekerjaan : null
    dataKontrak.pembayaran            = data.pembayaran //!='0000-00-00' ? data.pembayaran : null
    dataKontrak.namaPerusahaan        = data.namaPerusahaan
    dataKontrak.alamatPerusahaan      = data.alamatPerusahaan
    dataKontrak.namaDirektur          = data.namaDirektur
    dataKontrak.jabatan               = data.jabatan
    dataKontrak.npwpPerusahaan        = data.npwpPerusahaan

    dataKontrak.namaPerusahaanPembanding1        = data.namaPerusahaanPembanding1
    dataKontrak.alamatPerusahaanPembanding1        = data.alamatPerusahaanPembanding1
    dataKontrak.namaPerusahaanPembanding2        = data.namaPerusahaanPembanding2
    dataKontrak.alamatPerusahaanPembanding2        = data.alamatPerusahaanPembanding2
    dataKontrak.namaDirekturPembanding1        = data.namaDirekturPembanding1
    dataKontrak.namaDirekturPembanding2        = data.namaDirekturPembanding2
    dataKontrak.jabatanPmb1        = data.jabatanPmb1
    dataKontrak.jabatanPmb2        = data.jabatanPmb2
  
    dataKontrak.suratKesanggupan      = data.suratKesanggupan //!='0000-00-00' ? data.suratKesanggupan : null
    dataKontrak.namaGroupPokja        = data.namaGroupPokja
    dataKontrak.pokja1                = data.pokja1
    dataKontrak.pokja2                = data.pokja2
    dataKontrak.pokja3                = data.pokja3
    dataKontrak.pokja4                = data.pokja4
    dataKontrak.pokja5                = data.pokja5
    dataKontrak.nipPokja1             = data.nipPokja1

    dataKontrak.hrgtotal              = data.hrgtotal;
    dataKontrak.hrgtotalPNW           = data.hrgtotalPNW;
    dataKontrak.managementFeePctg     = data.mgmtFeePctg;
    dataKontrak.managementFeePctgPnw  = data.mgmtFeePctgPnw;
    dataKontrak.isPPN                 = data.isPPN == 1 ? true:false;
    dataKontrak.isPPNPnw              = data.isPPNPnw == 1 ? true:false;
    dataKontrak.cb_managementFee      = data.cb_managementFee == 1 ? true:false;
    dataKontrak.cb_managementFeePnw   = data.cb_managementFeePnw == 1 ? true:false;
    
    dataKontrak.isPctgMgmtFee         = data.isPctgMgmtFee;
    dataKontrak.isPctgMgmtFeePnw      = data.isPctgMgmtFeePnw;
    dataKontrak.mgmtFeeNmnl           = data.mgmtFeeNmnl;
    dataKontrak.mgmtFeeNmnlPnw        = data.mgmtFeeNmnlPnw;

    dataKontrak.nmr                   = data.nmr;

    dataKontrak.namaRek               = data.namaRek;
    dataKontrak.noRek                 = data.noRek;
    dataKontrak.bankRek               = data.bankRek;

    dataKontrak.pdtKoordinator        = data.pdtKoordinator;
    dataKontrak.pdtPPK                = data.pdtPPK;
    dataKontrak.pdtPPBJ               = data.pdtPPBJ;


    //dataKontrak.isHPSimg              = data.isHPSimg == 1 ? true:false;
    
    // if(data.mgmtFeePctg){
    //   document.getElementById('managementFeePctg').value = data.mgmtFeePctg;
    // }
    // if(data.mgmtFeePctgPnw){
    //   document.getElementById('managementFeePctgPnw').value = data.mgmtFeePctgPnw;
    // }
    // document.getElementById('cb_managementFee').checked = data.cb_managementFee == 1 ? true:false;
    // document.getElementById('cb_managementFeePnw').checked = data.cb_managementFeePnw == 1 ? true:false;
    // document.getElementById('isPPN').checked = data.isPPN == 1 ? true:false;
    // document.getElementById('isPPNPnw').checked = data.isPPNPnw == 1 ? true:false;

    //document.getElementById('chooserTipeHPS').selectedIndex = data.isHPSimg == null ? 0:(data.isHPSimg==1?2:1);
    this.setState({

      validasiJadwal  : data.pembayaran!='0000-00-00'?true:false,
      isManagementFee: data.cb_managementFee == 1 ? true:false,
      isManagementFeePnw: data.cb_managementFeePnw == 1 ? true:false,
      isPPN: data.isPPN == 1 ? true:false,
      isPPNPnw: data.isPPNPnw == 1 ? true:false,
      isPctgMgmtFee: data.isPctgMgmtFee,
      isPctgMgmtFeePnw: data.isPctgMgmtFeePnw,
      //isHPSimg: data.isHPSimg == 1 ? true:false,
      indexSatPlkPkj: data.indexSatPlkPkj||0,
      hrgtotal: data.hrgtotal,
      hrgtotalPNW: data.hrgtotalPNW
    })

    document.getElementById("namaPekerjaan").value          = data.namaPekerjaan;
    document.getElementById("suratPermintaanPPK").value     = data.suratPermintaanPPK;
    document.getElementById("pengadaanBarJas").value        = data.pengadaanBarJas;
    document.getElementById("HPS").value                    = data.HPS;
    document.getElementById("penawaranRKS").value           = data.penawaranRKS;
    document.getElementById("pengajuanPenawaran").value     = data.pengajuanPenawaran;
    document.getElementById("undanganEvaluasi").value       = data.undanganEvaluasi;
    document.getElementById("evaluasi").value               = data.evaluasi;
    document.getElementById("penetapanPenyedia").value      = data.penetapanPenyedia;
    document.getElementById("laporanPelaksanaan").value     = data.laporanPelaksanaan;
    document.getElementById("suratPemesanan").value         = data.suratPemesanan;
    document.getElementById("penandatangananKontrak").value = data.penandatangananKontrak;
    document.getElementById("pelaksanaanPekerjaan").value   = data.pelaksanaanPekerjaan;
    document.getElementById("penyelesaianPekerjaan").value  = data.penyelesaianPekerjaan;
    document.getElementById("pembayaran").value             = data.pembayaran;
    document.getElementById("namaPerusahaan").value         = data.namaPerusahaan;
    document.getElementById("alamatPerusahaan").value       = data.alamatPerusahaan;
    document.getElementById("namaDirektur").value           = data.namaDirektur;
    document.getElementById("jabatan").value                = data.jabatan;
    document.getElementById("npwpPerusahaan").value         = data.npwpPerusahaan;

    document.getElementById("namaPerusahaanPembanding1").value         = data.namaPerusahaanPembanding1;
    document.getElementById("alamatPerusahaanPembanding1").value         = data.alamatPerusahaanPembanding1;
    document.getElementById("namaPerusahaanPembanding2").value         = data.namaPerusahaanPembanding2;
    document.getElementById("alamatPerusahaanPembanding2").value         = data.alamatPerusahaanPembanding2;
    document.getElementById("namaDirekturPembanding1").value         = data.namaDirekturPembanding1;
    document.getElementById("namaDirekturPembanding2").value         = data.namaDirekturPembanding2;
    document.getElementById("jabatanPmb1").value         = data.jabatanPmb1;
    document.getElementById("jabatanPmb2").value         = data.jabatanPmb2;

    document.getElementById("suratKesanggupan").value       = data.suratKesanggupan;
    document.getElementById("namaGroupPokja").value         = data.namaGroupPokja;
    document.getElementById("pokja1").value         = data.pokja1;
    document.getElementById("pokja2").value         = data.pokja2;
    document.getElementById("pokja3").value         = data.pokja3;
    document.getElementById("pokja4").value         = data.pokja4;
    document.getElementById("pokja5").value         = data.pokja5;
    document.getElementById("nipPokja1").value         = data.nipPokja1;

    document.getElementById("nmr").value         = data.nmr;

    document.getElementById("namaRek").value         = data.namaRek;
    document.getElementById("noRek").value         = data.noRek;
    document.getElementById("bankRek").value         = data.bankRek;

    if(data.LSorNon == "LS"){
      document.getElementById("rdLS").checked = true;
      this.setState({message_step1_3:'',togleLS:false});
    }else if(data.LSorNon == "NonLS"){
      document.getElementById("rdNonLS").checked = true;
      this.setState({message_step1_3:'',msg_p6:'',msg_p7:'',msg_p8:'',togleLS:true});
    }
    // document.getElementById("chooserMgmtFee").selectedIndex         = data.isPctgMgmtFee;
    // document.getElementById("chooserMgmtFeePnw").selectedIndex         = data.isPctgMgmtFeePnw;
    // document.getElementById("mgmtFeeNmnl").value         = data.mgmtFeeNmnl;
    // document.getElementById("mgmtFeeNmnlPnw").value         = data.mgmtFeeNmnlPnw;
    
    if(this.props.tipe == "200up"){
      if(data.jenisPengadaan == "Barang"){
        document.getElementById("rdBrg").checked = true;
      }else if (data.jenisPengadaan == "Jasa Lainnya"){
        document.getElementById("rdJL").checked = true;
      }
    }

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
            console.log(dataAPI.data);
            dataKontrak.TABEL = dataAPI.data.tabel;
            tableHPS = dataAPI.data.tabel;
            this.setState({ TABEL: dataAPI.data.tabel });
            this.hitungTotal("HPS");
            
            dataKontrak.TABELPnw = dataAPI.data.tabelPnw;
            tablePnwrn = dataAPI.data.tabelPnw;
            this.setState({ TABELPnw: dataAPI.data.tabelPnw });
            this.hitungTotal("Pnw");

            if(dataAPI.data.tabelNego.length !== 0){
              var dtNego = setTabelNego(dataAPI.data.tabelNego);
              dataKontrak.TABELNego = dtNego;
              dataNegosiasi = dtNego;
              this.setState({ dataRenderNegosiasi: dtNego });
            }
            // if(dataAPI.data.img.length !== 0){
            //   dataKontrak.base64HPS = dataAPI.data.img[0].base64HPS;
            //   var img = document.getElementById("viewerHPSimg");
            //   img.src =  dataAPI.data.img[0].base64HPS;
            //   setTimeout(()=>{
            //     var width = img.naturalWidth;
            //     var height = img.naturalHeight;
            //     dataKontrak.HPSimgW = width;
            //     dataKontrak.HPSimgH = height;
            //     console.log("allowed : " +width+","+height);
            //   },500)
            // }
          }else{
            
          }
        });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const key = target.name;

    //console.log(event);
    dataKontrak[target.name] = value;
    if(target.type == "date"){
      this.validateStepTgl(key);
    }
    if(key=='pelaksanaanPekerjaan' || key=='penandatangananKontrak' || key=='penyelesaianPekerjaan'){
      dataKontrak = autoBAPP(key,dataKontrak);
      if(dataKontrak.message && dataKontrak.message != ""){
        console.log(dataKontrak.message); 
        this.notificationSystem.addNotification({
          title: <MdWarning />,
          message: dataKontrak.message,
          level: 'error',
          autoDismiss: 10,
        });
      }
      if(key=='pelaksanaanPekerjaan'){
        this.validatePelaksanaanPkj(value);
      }
    }
    if(key=='namaPerusahaan'){
      this.setState({msg_p1:''})
    }
    if(key=='alamatPerusahaan'){
      this.setState({msg_p2:''})
    }
    if(key=='namaDirektur'){
      this.setState({msg_p3:''})
    }
    if(key=='npwpPerusahaan'){
      this.setState({msg_p4:''})
    }
    if(key=='namaRek'){ this.setState({msg_p6:''}) };
    if(key=='noRek'){ this.setState({msg_p7:''}) };
    if(key=='bankRek'){ this.setState({msg_p8:''}) };

    if(key=='cb_managementFee' || key=='cb_managementFeePnw'){
      var flag = (key=='cb_managementFee')?"HPS":"Pnw";
      var fState = (key=='cb_managementFee')?"isManagementFee":"isManagementFeePnw";
      this.setState({[fState]:target.checked}, ()=>{
        this.hitungTotal(flag);
      });
    }
    if(key=='isPPN' || key=='isPPNPnw'){
      var flag = (key=='isPPN')?"HPS":"Pnw";
      var fState = (key=='isPPN')?"isPPN":"isPPNPnw";
      dataKontrak["isPPNPnw"] = value;
      dataKontrak["isPPN"] = value;
      this.setState({isPPN:target.checked,isPPNPnw:target.checked}, ()=>{
        this.hitungTotal("isPPN");
        this.hitungTotal("isPPNPnw");
      });
    }
    if(key=='managementFeePctg' || key=='managementFeePctgPnw'){
      //var ppn = this.state.subtotal * (0.1);
      var flag = (key=='managementFeePctg')?"HPS":"Pnw";
      this.hitungTotal(flag);
      // var mgmtFee = this.state.subtotal * (value/100);
      // var isMgt = this.state.isManagementFee;
      // var hrgtotal = this.state.subtotal + this.state.ppn + (isMgt?mgmtFee:0);
      // this.setState({managementFee:mgmtFee, hrgtotal:hrgtotal})
    }

    if(key=='qty' || key=='unitprice'){
      if(key=="unitprice" || key=="total"){
        const newVal = value.replace(/\+|-|[A-Z]|\W/ig, '');///^\d*\.?\d*$/.test(value);
        dataKontrak.unitprice = newVal;
        document.getElementById(key).value = commafy(newVal);
      }
      var qty = document.getElementById('qty').value || 0;
      var unt = document.getElementById('unitprice').value || '0';

      var tot = qty * removeComma(unt);
      dataKontrak.total = tot;
      document.getElementById('total').value = commafy(tot);
    }
    if(key=='qtyPnw' || key=='unitpricePnw'){
      if(key=="unitpricePnw" || key=="totalPnw"){
        const newVal = value.replace(/\+|-|[A-Z]|\W/ig, '');///^\d*\.?\d*$/.test(value);
        dataKontrak.unitpricePnw = newVal;
        document.getElementById(key).value = commafy(newVal);
      }
      var qty = document.getElementById('qtyPnw').value || 0;
      var unt = document.getElementById('unitpricePnw').value || '0';

      var tot = qty * removeComma(unt);
      dataKontrak.totalPnw = tot;
      document.getElementById('totalPnw').value = commafy(tot);
    }
    if(key=='chooserTipeHPS'){
      var map = [null,false,true];
      var val = Number.parseInt(value);
      dataKontrak.isHPSimg = map[val];
      this.setState({isHPSimg:map[val]});
    }
    if(key=='chooserTipePenawaran'){
      var map = [null,false,true];
      var val = Number.parseInt(value);
      dataKontrak.isPenawaranimg = map[val];
      this.setState({isPenawaranimg:map[val]});
    }
    if(key=="hrgtotal" || key == "hrgtotalPNW"){
      const newVal = value.replace(/\+|-|[A-Z]|\W/ig, '');///^\d*\.?\d*$/.test(value);
      dataKontrak[key] = newVal;
      //document.getElementById(key).value = commafy(newVal);
    }
    if(target.type=="file"){
      this.setState({[key]:''});
      //console.log(event.target.files[0]);
      this.getFile(event.target.files[0],key);
    }
    if(key=='chooserMgmtFee'){
      dataKontrak.isPctgMgmtFee = value;
      this.setState({isPctgMgmtFee: value});
    }
    if(key=='chooserMgmtFeePnw'){
      dataKontrak.isPctgMgmtFeePnw = value;
      this.setState({isPctgMgmtFeePnw: value});
    }
    if(key=="mgmtFeeNmnl" || key=="mgmtFeeNmnlPnw"){
      const newVal = value.replace(/\+|-|[A-Z]|\W/ig, '');///^\d*\.?\d*$/.test(value);
      dataKontrak[key] = newVal;
      document.getElementById(key).value = commafy(newVal);
      var flag = (key=='mgmtFeeNmnl')?"HPS":"Pnw";
      this.hitungTotal(flag);
    }
  }
  getFile(file,keyname){
    var allowedFileTypes = ["image/png", "image/jpeg"];
    
    //console.log("namafile: "+ file.name);
    
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
        var img = document.getElementById('viewer'+keyname); 
        img.src = base64data;
        setTimeout(()=>{
          var width = img.naturalWidth;
          var height = img.naturalHeight;
          dataKontrak[keyname+"W"] = width;
          dataKontrak[keyname+"H"] = height;
          console.log("allowed : " +width+","+height);
        },500)
        dataKontrak["base64"+keyname.replace("img","")] = base64data;
      }
      
    }else{
      console.log("not allowed");
      this.setState({[keyname]:'format file tidak diijinkan'});
      document.getElementById("viewer"+keyname).src = '';
    }
  }


  validatePelaksanaanPkj(durasi){
    if(durasi<1){
      this.setState({msg_j12:"Tidak boleh kurang dari 1"})
      return false;
    }else{
      this.setState({msg_j12:""})
      if(dataKontrak.pembayaran < dataKontrak.penyelesaianPekerjaan && dataKontrak.pembayaran != this.state.tglKosong){
        var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
        var vldt = false;
        this.setState({msg_j14:msg, validasiJadwal:vldt})
        return false;
      }else{this.setState({msg_j14:'', validasiJadwal:true}) }
      return true;
    }
  }
  validateStepTgl(key){
    var vldt = true;
    var tglKosong = this.state.tglKosong;
    if(dataKontrak.pengadaanBarJas < dataKontrak.suratPermintaanPPK && dataKontrak.pengadaanBarJas != tglKosong){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j2:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j2:'', validasiJadwal:true}) }
    if(dataKontrak.HPS < dataKontrak.pengadaanBarJas && dataKontrak.HPS != tglKosong){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j3:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j3:'', validasiJadwal:true}) }
    if(dataKontrak.penawaranRKS < dataKontrak.HPS  && dataKontrak.penawaranRKS != tglKosong){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j4:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j4:'', validasiJadwal:true}) }
    if(dataKontrak.pengajuanPenawaran < dataKontrak.penawaranRKS  && dataKontrak.pengajuanPenawaran != tglKosong){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j5:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j5:'', validasiJadwal:true}) }
    if(dataKontrak.undanganEvaluasi < dataKontrak.pengajuanPenawaran  && dataKontrak.undanganEvaluasi != tglKosong){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j6:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j6:'', validasiJadwal:true}) }
    if(dataKontrak.evaluasi < dataKontrak.undanganEvaluasi && dataKontrak.evaluasi != tglKosong){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j7:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j7:'', validasiJadwal:true}) }
    if(dataKontrak.penetapanPenyedia < dataKontrak.evaluasi && dataKontrak.penetapanPenyedia != tglKosong){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j8:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j8:'', validasiJadwal:true}) }
    if(dataKontrak.laporanPelaksanaan < dataKontrak.penetapanPenyedia && dataKontrak.laporanPelaksanaan != tglKosong){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j9:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j9:'', validasiJadwal:true}) }
    if(dataKontrak.suratPemesanan < dataKontrak.laporanPelaksanaan && dataKontrak.suratPemesanan != tglKosong){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j10:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j10:'', validasiJadwal:true}) }
    if(dataKontrak.penandatangananKontrak < dataKontrak.suratPemesanan && dataKontrak.penandatangananKontrak != tglKosong){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j11:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j11:'', validasiJadwal:true}) }
    // if(dataKontrak.penyelesaianPekerjaan < dataKontrak.penandatangananKontrak && dataKontrak.penyelesaianPekerjaan != tglKosong){
    //   var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
    //   vldt = false;
    //   this.setState({msg_j13:msg, validasiJadwal:vldt})
    // }else{this.setState({msg_j13:'', validasiJadwal:true}) }
    if(dataKontrak.pembayaran < dataKontrak.penyelesaianPekerjaan && dataKontrak.pembayaran != tglKosong){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j14:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j14:'', validasiJadwal:true}) }

    if(key=="suratPermintaanPPK"){
      var msg = '';
      this.setState({j2:false, msg_j1:msg})
    }
    if(key=="pengadaanBarJas"){
      var msg = '';
      if(dataKontrak.pengadaanBarJas < dataKontrak.suratPermintaanPPK){
        msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
        vldt = false;
      }
      this.setState({j3:false, msg_j2:msg, validasiJadwal:vldt});
    }
    if(key=="HPS"){
      var msg = ''; 
      if(dataKontrak.HPS < dataKontrak.pengadaanBarJas){
        msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
        vldt = false;
      }
      this.setState({j4:false, msg_j3:msg, validasiJadwal:vldt})
    }
    if(key=="penawaranRKS"){
      var msg = '';
      if(dataKontrak.penawaranRKS < dataKontrak.HPS){
        msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
        vldt = false;
      }
      this.setState({j5:false, msg_j4:msg, validasiJadwal:vldt})
    }
    if(key=="pengajuanPenawaran"){
      var msg = '';
      if(dataKontrak.pengajuanPenawaran < dataKontrak.penawaranRKS){
        msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
        vldt = false;
      }
      this.setState({j6:false, msg_j5:msg, validasiJadwal:vldt})
    }
    if(key=="undanganEvaluasi"){
      var msg = '';
      if(dataKontrak.undanganEvaluasi < dataKontrak.pengajuanPenawaran){
        msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
        vldt = false;
      }
      this.setState({j7:false, msg_j6:msg, validasiJadwal:vldt})
    }
    if(key=="evaluasi"){
      var msg = '';
      if(dataKontrak.evaluasi < dataKontrak.undanganEvaluasi){
        msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
        vldt = false;
      }
      this.setState({j8:false, msg_j7:msg, validasiJadwal:vldt})
    }
    if(key=="penetapanPenyedia"){
      var msg = '';
      if(dataKontrak.penetapanPenyedia < dataKontrak.evaluasi){
        msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
        vldt = false;
      }
      this.setState({j9:false, msg_j8:msg, validasiJadwal:vldt})
    }
    if(key=="laporanPelaksanaan"){
      var msg = '';
      if(dataKontrak.laporanPelaksanaan < dataKontrak.penetapanPenyedia){
        msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
        vldt = false;
      }
      this.setState({j10:false, msg_j9:msg, validasiJadwal:vldt})
    }
    if(key=="suratPemesanan"){
      var msg = '';
      if(dataKontrak.suratPemesanan < dataKontrak.laporanPelaksanaan){
        msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
        vldt = false;
      }
      this.setState({j11:false, msg_j10:msg, validasiJadwal:vldt})
    }
    if(key=="penandatangananKontrak"){
      var msg = '';
      if(dataKontrak.penandatangananKontrak < dataKontrak.suratPemesanan){
        msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
        vldt = false;
      }
      this.setState({j13:false, j14:false, msg_j11:msg, validasiJadwal:vldt})
    }
    // if(key=="penyelesaianPekerjaan"){
    //   var msg = '';
    //   if(dataKontrak.penyelesaianPekerjaan < dataKontrak.penandatangananKontrak){
    //     msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
    //     vldt = false;
    //   }
    //   this.setState({j14:false, msg_j13:msg, validasiJadwal:vldt})
    // }
    if(key=="pembayaran"){
      var msg = '';
      if(dataKontrak.pembayaran < dataKontrak.penyelesaianPekerjaan){
        msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
        vldt = false;
      }
      this.setState({msg_j14:msg, validasiJadwal:vldt})
    }

  }
  handleOnBlurTGL(event){
    const target = event.target;
  }
  handleSubmit = (type) => {
    dataKontrak.satPlkPkj = document.getElementById("chooserSatPlkPkj").value;
    dataKontrak.indexSatPlkPkj = document.getElementById("chooserSatPlkPkj").selectedIndex;
    
    if(this.state.tipe == '200up'){
      var radio = document.querySelector('input[name="radio2"]:checked');
      if(radio!=null){
        dataKontrak.jenisPengadaan = radio.value;
      }
    }

    var radioLS = document.querySelector('input[name="radio_LS"]:checked');
      if(radioLS!=null){
        dataKontrak.LSorNon = radioLS.value;
      }

    dataKontrak.TABELNego = dataNegosiasi;
    dataKontrak.TABEL = [{
      descr: "descr",
      qty: 1,
      freq: 1,
      unitprice: commafy(this.state.hrgtotal),
      total: commafy(this.state.hrgtotal),
    }]
    dataKontrak.TABELPnw = [{
      descr: "descr",
      qty: 1,
      freq: 1,
      unitprice: commafy(this.state.hrgtotal),
      total: commafy(this.state.hrgtotal),
    }]
    dataKontrak.isPPN     = 0;
    dataKontrak.isPPNPnw  = 0;
    console.log(dataKontrak);
    //return;
    var IsOK = false;
    if(type=="save"){
      if(dataKontrak.namaPekerjaan == '' || dataKontrak.namaPekerjaan == null){
        if (!this.notificationSystem) {
          return;
        }
        this.notificationSystem.addNotification({
          title: <MdWarning />,
          message: 'Tidak ada data yang disimpan',
          level: 'error',
        });
        return;
      }
    }
    if(type=="generate"){
      generateDocument(dataKontrak,this.getnameFile());
      //return;
    }
    //return;
    //var dt = pushKontrak(dataKontrak);
    const requestOptions = {
      method: 'POST',
      //headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataKontrak)
    };
    fetch(process.env.REACT_APP_URL_API+'/rest/insertKontrak.php', requestOptions)
    .then(response => response.json())
    .then(respon => {
        const dataAPI = respon;
        console.log(dataAPI)
        if(dataAPI.response_code != 200){
          IsOK = false;
        }else{
          IsOK = true;
            //return {respon: true,message: dataAPI.message};
            //window.location.href = "/kontraksaya"
        }
    })
    .then(()=> {
      if (!this.notificationSystem) {
        return;
      }
      this.notificationSystem.addNotification({
        title: <MdCloudUpload />,
        message: IsOK? 'Data berhasil disimpan':'Data gagal disimpan ke server',
        level: IsOK?'success':'error',
      });

      if(IsOK){
        setTimeout(() => {
          this.props.history.push('/kontraksaya');
        }, 1000);     
      }
    });
  };

  handleNext=(nextStep)=>{
    window.scrollTo(0, 0);
    if(nextStep==1){
      if(this.validation_step1()==false){
        return;
      }
    }

    if(nextStep==2){
      if(this.validation_step2()==false){
        return;
      }
      if(this.validatePelaksanaanPkj(document.getElementById('pelaksanaanPekerjaan').value)==false){
        return;
      }
    }
    if(nextStep==3){
      if(this.validation_step3()==false){
        return;
      }
    }
    const temp = ['none','none','none','none','none','none'];
    temp[nextStep] = 'block';
    //console.log(temp);
    this.setState({
      step: temp,
      activeStep: nextStep
    });
  };
  validation_step2(){
    var data = dataKontrak;
    var cFalse = 0;
    var tglKosong = this.state.tglKosong;
    if(data.suratPermintaanPPK==tglKosong){
      this.setState({msg_j1: 'Harus diisi !!'});
      cFalse++;
    }
    if(data.pengadaanBarJas==tglKosong){
      this.setState({msg_j2: 'Harus diisi !!'});
      cFalse++;
    }
    if(data.HPS==tglKosong){
      this.setState({msg_j3: 'Harus diisi !!'});
      cFalse++;
    }
    if(data.penawaranRKS==tglKosong){
      this.setState({msg_j4: 'Harus diisi !!'});
      cFalse++;
    }
    if(data.pengajuanPenawaran==tglKosong){
      this.setState({msg_j5: 'Harus diisi !!'});
      cFalse++;
    }
    if(data.undanganEvaluasi==tglKosong){
      this.setState({msg_j6: 'Harus diisi !!'});
      cFalse++;
    }
    if(data.evaluasi==tglKosong){
      this.setState({msg_j7: 'Harus diisi !!'});
      cFalse++;
    }
    if(data.penetapanPenyedia==tglKosong){
      this.setState({msg_j8: 'Harus diisi !!'});
      cFalse++;
    }
    if(data.laporanPelaksanaan==tglKosong){
      this.setState({msg_j9: 'Harus diisi !!'});
      cFalse++;
    }
    if(data.suratPemesanan==tglKosong){
      this.setState({msg_j10: 'Harus diisi !!'});
      cFalse++;
    }
    if(data.penandatangananKontrak==tglKosong){
      this.setState({msg_j11: 'Harus diisi !!'});
      cFalse++;
    }
    if(data.pelaksanaanPekerjaan==tglKosong){
      this.setState({msg_j12: 'Harus diisi !!'});
      cFalse++;
    }
    if(data.penyelesaianPekerjaan==tglKosong){
      this.setState({msg_j13: 'Harus diisi !!'});
      cFalse++;
    }
    if(data.pembayaran==tglKosong){
      this.setState({msg_j14: 'Harus diisi !!'});
      cFalse++;
    }

    if(cFalse>0 || this.state.validasiJadwal==false){
      return false;
    }else{
      return true;
    }
  }
  validation_step1(){
    
    var data = dataKontrak;
    if(!data.namaPekerjaan){
      this.setState({message_step1: 'Nama Pekerjaan Harus diisi !!'});
      return false;
    }

    if(this.state.tipe == '200up'){
      var radio = document.querySelector('input[name="radio2"]:checked');
      if(radio==null){
        this.setState({message_step1_2: 'Pilih salah satu !!'});
        return false;
      }
    }
    if(!data.pdtKoordinator){
      this.setState({msg_p1: 'Pilih penandatangan dulu !!'});
      return false;
    }
    if(!data.pdtPPK){
      this.setState({msg_p1: 'Pilih penandatangan dulu !!'});
      return false;
    }
    if(!data.pdtPPBJ){
      this.setState({msg_p1: 'Pilih penandatangan dulu !!'});
      return false;
    }
  }
  validation_step3(){
    var data = dataKontrak;var cFalse = 0;
    var radio = document.querySelector('input[name="radio_LS"]:checked');
    
    if(radio==null){
      this.setState({message_step1_3: 'Pilih dulu LS apa GU !!'});
      return false;
    }
    else if(radio.value=="LS"){
      if(!data.namaRek){
        this.setState({msg_p6: 'INI DIISI DULU SAYANG !!'});
        cFalse++;
      }
      if(!data.noRek){
        this.setState({msg_p7: 'INI DIISI DULU SAYANG !!'});
        cFalse++;
      }
      if(!data.bankRek){
        this.setState({msg_p8: 'INI DIISI DULU SAYANG !!'});
        cFalse++;
      }
      if(cFalse>0){
        return false;
      }
    }

    
    
    if(!data.namaPerusahaan){
      this.setState({msg_p1: 'Harus diisi !!'});
      cFalse++;
    }
    if(!data.namaDirektur){
      this.setState({msg_p3: 'Harus diisi !!'});
      cFalse++;
    }
    if(!data.alamatPerusahaan){
      this.setState({msg_p2: 'Harus diisi !!'});
      cFalse++;
    }
    if(!data.npwpPerusahaan){
      this.setState({msg_p4: 'Harus diisi !!'});
      cFalse++;
    }

    if(cFalse>0){
      return false;
    }else{
      return true;
    }
  }

  handleSearchPerusahaan(){
    const requestOptions = {
      method: 'POST',
      //headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({namaPerusahaan: dataKontrak.namaPerusahaan})
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
      options.push(<option key={i}>{data[i].namaPerusahaan}, {data[i].alamatPerusahaan.replace('\n',' ')}</option>)
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
          document.getElementById('namaRek').value = dtChoosed.namaRek;
          document.getElementById('noRek').value = dtChoosed.noRek;
          document.getElementById('bankRek').value = dtChoosed.bankRek;

          dataKontrak.namaPerusahaan    = dtChoosed.namaPerusahaan;
          dataKontrak.alamatPerusahaan  = dtChoosed.alamatPerusahaan;
          dataKontrak.namaDirektur      = dtChoosed.namaDirektur;
          dataKontrak.jabatan           = dtChoosed.jabatan;
          dataKontrak.npwpPerusahaan    = dtChoosed.npwpPerusahaan;
          dataKontrak.namaRek           = dtChoosed.namaRek;
          dataKontrak.noRek             = dtChoosed.noRek;
          dataKontrak.bankRek           = dtChoosed.bankRek;
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
      options.push(<option key={i} value={data[i].id} selected={data[i].id==dataKontrak.pdtKoordinator?true:false}>{data[i].nama} | {data[i].nip}</option>)
    }
    return (
      <Input 
        //hidden={this.state.hideChooser}
        type="select" name="chooserKoordinator" 
        id="chooserKoordinator" 
        onChange={()=>{
          var idx = document.getElementById('chooserKoordinator').selectedIndex;
          //console.log(document.getElementById('chooser').selectedIndex)
          //this.setState({hideChooser:true, msg_p1:'', msg_p2:'', msg_p3:'', msg_p4:''});
          var dtChoosed = data[idx];

          dataKontrak.pdtKoordinator    = dtChoosed.id;
          dataKontrak.koordinator    = dtChoosed.nama;
          dataKontrak.nipkoordinator    = dtChoosed.nip;
          console.log(dataKontrak);
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
      options.push(<option key={i} value={data[i].id} selected={data[i].id==dataKontrak.pdtPPK?true:false}>{data[i].nama} | {data[i].nip}</option>)
    }
    return (
      <Input 
        //hidden={this.state.hideChooser}
        type="select" name="chooserPPK" 
        id="chooserPPK" 
        onChange={()=>{
          var idx = document.getElementById('chooserPPK').selectedIndex;
          //console.log(document.getElementById('chooser').selectedIndex)
          //this.setState({hideChooser:true, msg_p1:'', msg_p2:'', msg_p3:'', msg_p4:''});
          var dtChoosed = data[idx];

          dataKontrak.pdtPPK    = dtChoosed.id;
          dataKontrak.PPK    = dtChoosed.nama;
          dataKontrak.nipPPK    = dtChoosed.nip;
          this.setState({msg_p1: ''});
        }}
      >
        {options}
      </Input>
    )
  }

  renderChooserPPBJ(){
    var data = pdtPPBJ;
    
    if(!data){
      return null;
    }
    var datalen = data.length;
    var options = [];
    for(var i = 0; i < datalen; i++){
      options.push(<option key={i} value={data[i].id} selected={data[i].id==dataKontrak.pdtPPBJ?true:false}>{data[i].nama} | {data[i].nip}</option>)
    }
    return (
      <Input 
        //hidden={this.state.hideChooser}
        type="select" name="chooserPPBJ" 
        id="chooserPPBJ" 
        onChange={()=>{
          var idx = document.getElementById('chooserPPBJ').selectedIndex;
          //console.log(document.getElementById('chooser').selectedIndex)
          //this.setState({hideChooser:true, msg_p1:'', msg_p2:'', msg_p3:'', msg_p4:''});
          var dtChoosed = data[idx];

          dataKontrak.pdtPPBJ    = dtChoosed.id;
          dataKontrak.PPBJ    = dtChoosed.nama;
          dataKontrak.nipPPBJ    = dtChoosed.nip;
          this.setState({msg_p1: ''});
        }}
      >
        {options}
      </Input>
    )
  }
  
  render(){
    return (
      <header>
        <NotificationSystem
          dismissible={false}
          ref={notificationSystem =>
            (this.notificationSystem = notificationSystem)
          }
          style={NOTIFICATION_SYSTEM_STYLE}
        />
      <Page
        title="Input Kontrak"
        breadcrumbs={[{ name: this.getBreadcrumbs(this.props.tipe), active: true }]}
      >
        <Row>
          <Col xl={12} lg={12} md={12}>
            <Stepper 
            styleConfig={{
              activeBgColor:"#146df3",
              completedBgColor:"#061d9e"
            }}
            activeStep={this.state.activeStep}>
              <Step label="Nama Pekerjaan" onClick={()=>{this.handleNext(0)}}/>
              <Step label="Jadwal Pekerjaan" onClick={()=>{this.handleNext(1)}}/>
              <Step label="Perusahaan Pemenang" onClick={()=>{this.handleNext(2)}}/>
              <Step label="BAEKN" onClick={()=>{this.handleNext(3)}}/>
              {/* <Step label="Tabel SPK" onClick={()=>{this.handleNext(4)}}/> */}
              {this.isUp200()?<Step label="Pokja" onClick={()=>{this.handleNext(4)}}/>:null}
              
            </Stepper>
          </Col>
        </Row>
        
        <br/>
        <Row>
          <Col>
          {/* <Card> */}
            {/* <CardHeader>Input Types</CardHeader> */}
            {/* <CardBody> onSubmit={this.handleSubmit} */}
              <Form >
              <Card style={{display:this.state.step[0]}}>
                
                <CardHeader>Input Nama Pekerjaan</CardHeader>
                <CardBody>
                  <Row>
                    <Col xl={12} lg={12} md={12}>
                      <FormGroup row>
                        <Label for="namaPekerjaan" sm={2}>
                          Nama Pekerjaan
                        </Label>
                        <Col sm={10}>
                          <Input
                            type="text"
                            id="namaPekerjaan"
                            name="namaPekerjaan"
                            placeholder="nama kontrak"
                            onChange={this.handleInputChange}
                            onKeyUp={()=>{this.setState({message_step1:''})}}
                          />
                          <FormText color={'danger'}>{this.state.message_step1}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="namaPekerjaan" sm={2}>
                          Nomor Kontrak
                        </Label>
                        <Col sm={4}>
                          <Input
                            type="text"
                            id="nmr"
                            name="nmr"
                            placeholder="nomor kontrak"
                            onChange={this.handleInputChange}
                            onKeyUp={()=>{this.setState({message_step1:''})}}
                          />
                          <FormText style={{fontSize:12}}>kalo belom ada nomor kontrak dari PPBJ kosongin aja yah, nanti bisa diedit di menu 'Kontrak Saya'</FormText>
                        </Col>
                      </FormGroup>
                      
                      {this.props.tipe == "200up"?
                        <FormGroup tag="fieldset" row>
                        <Label for="jenisPengadaan" sm={2}>
                          Jenis Pengadaan
                        </Label>
                        <Col sm={10}>
                          <FormGroup check>
                            <Label check>
                              <Input id="rdBrg" onChange={()=>{this.setState({message_step1_2:''})}} type="radio" name="radio2" value="Barang" /> Barang
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input id="rdJL" onChange={()=>{this.setState({message_step1_2:''})}} type="radio" name="radio2" value="Jasa Lainnya" /> Jasa Lainnya
                            </Label>
                          </FormGroup>
                          <FormText color={'danger'}>{this.state.message_step1_2}</FormText>
                        </Col>
                      </FormGroup>
                      :null}
                    </Col>
                    
                  </Row>
                </CardBody>
                <hr/>
                <CardHeader>Penandatangan</CardHeader>
                <CardBody>
                  <Row>
                    <Col xl={12} lg={12} md={12}>
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
                      <FormGroup row>
                        <Label for="hrgtotal" sm={2}>
                          PPBJ
                        </Label>
                        <Col sm={4}>
                        {this.renderChooserPPBJ()}
                          <FormText color={'danger'}>{this.state.msg_p1}</FormText>
                        </Col>
                      </FormGroup>
                    </Col>
                    <hr/>
                    <Col xl={12} lg={12} md={12}>
                      <FormGroup row className="d-flex justify-content-end">
                        <Col sm={3} className="d-flex justify-content-end">
                          <Button color="danger" onClick={()=>{this.props.history.goBack();}}>Batal</Button> &nbsp;
                          {/* {this.renderBtnSaveDraft()} &nbsp; */}
                          <Button color="primary" onClick={()=> this.handleNext(1)}>Selanjutnya</Button>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <br/>
              <Card style={{display:this.state.step[1]}}>
                <CardHeader>Input Jadwal Pekerjaan</CardHeader>
                <CardBody>
                  <Row>
                    <Col xl={12} lg={12} md={12}>
                      <FormGroup row>
                        <Label sm={1} style={{maxWidth:'4%'}}>1</Label>
                        <Label for="suratPermintaanPPK" sm={6}>
                          Surat Permintaan kepada PPK untuk melaksanakan Pengadaan Barang/Jasa
                        </Label>
                        <Col sm={3}>
                          <Input
                            type="date"
                            name="suratPermintaanPPK"
                            id="suratPermintaanPPK"
                            placeholder="date placeholder"
                            onChange={this.handleInputChange}
                            //onBlur={()=>{console.log('finish tgl')}}
                            //onKeyUp={()=>{this.setState({msg_j1:''})}}
                            //onBlur={()=>{this.setState({msg_j1:''})}}
                            //value={'2021-06-27'}
                          />
                          <FormText color={'danger'}>{this.state.msg_j1}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm={1} style={{maxWidth:'4%'}}>2</Label>
                        <Label for="pengadaanBarJas" sm={6}>
                          Pengadaan Barang dan Jasa
                        </Label>
                        <Col sm={3}>
                          <Input
                            disabled={this.state.j2}
                            type="date"
                            name="pengadaanBarJas"
                            id="pengadaanBarJas"
                            placeholder="date placeholder"
                            onChange={this.handleInputChange}
                            //onKeyUp={()=>{this.setState({msg_j2:''})}}
                            //onBlur={()=>{this.setState({msg_j2:''})}}
                          />
                          <FormText color={'danger'}>{this.state.msg_j2}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm={1} style={{maxWidth:'4%'}}>3</Label>
                        <Label for="HPS" sm={6}>
                          HPS
                        </Label>
                        <Col sm={3}>
                          <Input
                            disabled={this.state.j3}
                            type="date"
                            name="HPS"
                            id="HPS"
                            placeholder="date placeholder"
                            onChange={this.handleInputChange}
                            //onKeyUp={()=>{this.setState({msg_j3:''})}}
                            //onBlur={()=>{this.setState({msg_j3:''})}}
                          />
                          <FormText color={'danger'}>{this.state.msg_j3}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm={1} style={{maxWidth:'4%'}}>4</Label>
                        <Label for="penawaranRKS" sm={6}>
                          Permintaan Penawaran dilampiri RKS
                        </Label>
                        <Col sm={3}>
                          <Input
                            disabled={this.state.j4}
                            type="date"
                            name="penawaranRKS"
                            id="penawaranRKS"
                            placeholder="date placeholder"
                            onChange={this.handleInputChange}
                            //onKeyUp={()=>{this.setState({msg_j4:''})}}
                            //onBlur={()=>{this.setState({msg_j4:''})}}
                          />
                          <FormText color={'danger'}>{this.state.msg_j4}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm={1} style={{maxWidth:'4%'}}>5</Label>
                        <Label for="pengajuanPenawaran" sm={6}>
                          Pengajuan Penawaran (Dilampiri SIUP, Akte Notaris, NPWP, Bukti Pembayaran pajak Terakhir)
                        </Label>
                        <Col sm={3}>
                          <Input
                          disabled={this.state.j5}
                            type="date"
                            name="pengajuanPenawaran"
                            id="pengajuanPenawaran"
                            placeholder="date placeholder"
                            onChange={this.handleInputChange}
                            //onKeyUp={()=>{this.setState({msg_j5:''})}}
                            //onBlur={()=>{this.setState({msg_j5:''})}}
                          />
                          <FormText color={'danger'}>{this.state.msg_j5}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm={1} style={{maxWidth:'4%'}}>6</Label>
                        <Label for="undanganEvaluasi" sm={6}>
                          {'Undangan Evaluasi Klarifikasi & negosiasi'}
                        </Label>
                        <Col sm={3}>
                          <Input
                          disabled={this.state.j6}
                            type="date"
                            name="undanganEvaluasi"
                            id="undanganEvaluasi"
                            placeholder="date placeholder"
                            onChange={this.handleInputChange}
                            //onKeyUp={()=>{this.setState({msg_j6:''})}}
                            //onBlur={()=>{this.setState({msg_j6:''})}}
                          />
                          <FormText color={'danger'}>{this.state.msg_j6}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm={1} style={{maxWidth:'4%'}}>7</Label>
                        <Label for="evaluasi" sm={6}>
                          {"Evaluasi Klarifikasi & negosiasi"}
                        </Label>
                        <Col sm={3}>
                          <Input
                          disabled={this.state.j7}
                            type="date"
                            name="evaluasi"
                            id="evaluasi"
                            placeholder="date placeholder"
                            onChange={this.handleInputChange}
                            //onKeyUp={()=>{this.setState({msg_j7:''})}}
                            //onBlur={()=>{this.setState({msg_j7:''})}}
                          />
                          <FormText color={'danger'}>{this.state.msg_j7}</FormText>
                        </Col>
                      </FormGroup>
                    </Col>

                    <Col xl={12} lg={12} md={12}>          
                      <FormGroup row>
                        <Label sm={1} style={{maxWidth:'4%'}}>8</Label>
                        <Label for="penetapanPenyedia" sm={6}>
                          Penetapan Penyedia Barang/Jasa (SPPBJ)
                        </Label>
                        <Col sm={3}>
                          <Input
                          disabled={this.state.j8}
                            type="date"
                            name="penetapanPenyedia"
                            id="penetapanPenyedia"
                            placeholder="date placeholder"
                            onChange={this.handleInputChange}
                            //onKeyUp={()=>{this.setState({msg_j8:''})}}
                            //onBlur={()=>{this.setState({msg_j8:''})}}
                          />
                          <FormText color={'danger'}>{this.state.msg_j8}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row 
                        hidden={this.props.tipe=="100up"||this.props.tipe=='200up'?false:true}
                      >
                        <Label sm={1} style={{maxWidth:'4%'}}>9</Label>
                        <Label for="suratKesanggupan" sm={6}>
                          Surat Kesanggupan
                        </Label>
                        <Col sm={3}>
                          <Input
                            hidden={this.props.tipe=="100up"||this.props.tipe=='200up'?false:true}
                            disabled={this.state.j15}
                            type="date"
                            name="suratKesanggupan"
                            id="suratKesanggupan"
                            placeholder="date placeholder"
                            onChange={this.handleInputChange}
                            //onKeyUp={()=>{this.setState({msg_j8:''})}}
                            //onBlur={()=>{this.setState({msg_j8:''})}}
                          />
                          <FormText color={'danger'}>{this.state.msg_j15}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm={1} style={{maxWidth:'4%'}}>{this.isUp200()?'10':'9'}</Label>
                        <Label for="laporanPelaksanaan" sm={6}>
                          Laporan Pelaksanaan Pengadaan Barang dan Jasa
                        </Label>
                        <Col sm={3}>
                          <Input
                          disabled={this.state.j9}
                            type="date"
                            name="laporanPelaksanaan"
                            id="laporanPelaksanaan"
                            placeholder="date placeholder"
                            onChange={this.handleInputChange}
                            //onKeyUp={()=>{this.setState({msg_j9:''})}}
                            //onBlur={()=>{this.setState({msg_j9:''})}}
                          />
                          <FormText color={'danger'}>{this.state.msg_j9}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm={1} style={{maxWidth:'4%'}}>{this.isUp200()?'11':'10'}</Label>
                        <Label for="suratPemesanan" sm={6}>
                          Surat Pemesanan
                        </Label>
                        <Col sm={3}>
                          <Input
                          disabled={this.state.j10}
                            type="date"
                            name="suratPemesanan"
                            id="suratPemesanan"
                            placeholder="date placeholder"
                            onChange={this.handleInputChange}
                            //onKeyUp={()=>{this.setState({msg_j10:''})}}
                            //onBlur={()=>{this.setState({msg_j10:''})}}
                          />
                          <FormText color={'danger'}>{this.state.msg_j10}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm={1} style={{maxWidth:'4%'}}>{this.isUp200()?'12':'11'}</Label>
                        <Label for="penandatangananKontrak" sm={6}>
                          Penandatanganan Kontrak SPK
                        </Label>
                        <Col sm={3}>
                          <Input
                            disabled={this.state.j11}
                            type="date"
                            name="penandatangananKontrak"
                            id="penandatangananKontrak"
                            placeholder="date placeholder"
                            onChange={this.handleInputChange}
                            //onKeyUp={()=>{this.setState({msg_j11:''})}}
                            //onBlur={()=>{this.setState({msg_j11:''})}}
                          />
                          <FormText color={'danger'}>{this.state.msg_j11}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm={1} style={{maxWidth:'4%'}}>{this.isUp200()?'13':'12'}</Label>
                        <Label for="pelaksanaanPekerjaan" sm={6}>
                          Pelaksanaan Pekerjaan
                        </Label>
                        <Col sm={2}>
                          <Input
                          disabled={this.state.j12}
                            type="number"
                            name="pelaksanaanPekerjaan"
                            id="pelaksanaanPekerjaan"
                            placeholder="durasi"
                            onChange={this.handleInputChange}
                            //onKeyUp={()=>{this.setState({msg_j12:''})}}
                            //onBlur={()=>{this.setState({msg_j12:''})}}
                          />
                          <FormText color={'danger'}>{this.state.msg_j12}</FormText>
                        </Col>
                        <Col sm={3}>
                          {reSatPlkPkjChooser(this.state.indexSatPlkPkj)}
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm={1} style={{maxWidth:'4%'}}>{this.isUp200()?'14':'13'}</Label>
                        <Label for="penyelesaianPekerjaan" sm={6}>
                          BA Penyelesaian Pekerjaan Barang/Jasa
                        </Label>
                        <Col sm={3}>
                          <Input
                          disabled={this.state.j13}
                            type="date"
                            name="penyelesaianPekerjaan"
                            id="penyelesaianPekerjaan"
                            placeholder="date placeholder"
                            onChange={this.handleInputChange}
                            //onKeyUp={()=>{this.setState({msg_j13:''})}}
                            //onBlur={()=>{this.setState({msg_j13:''})}}
                          />
                          <FormText color={'danger'}>{this.state.msg_j13}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm={1} style={{maxWidth:'4%'}}>{this.isUp200()?'15':'14'}</Label>
                        <Label for="pembayaran" sm={6}>
                          BA Pembayaran 
                        </Label>
                        <Col sm={3}>
                          <Input
                          disabled={this.state.j14}
                            type="date"
                            name="pembayaran"
                            id="pembayaran"
                            placeholder="date placeholder"
                            onChange={this.handleInputChange}
                            //onKeyUp={()=>{this.setState({msg_j14:''})}}
                            //onBlur={()=>{this.setState({msg_j14:''})}}
                          />
                          <FormText color={'danger'}>{this.state.msg_j14}</FormText>
                        </Col>
                      </FormGroup>
                    </Col>
                    <hr/>
                    <Col xl={12} lg={12} md={12}>
                      <FormGroup row className="d-flex justify-content-end">
                        <Col sm={3} className="d-flex justify-content-end">
                          <Button color="danger" onClick={()=>this.handleNext(0)}>Kembali</Button> &nbsp;
                          {/* {this.renderBtnSaveDraft()} &nbsp; */}
                          <Button color="primary" onClick={()=>this.handleNext(2)}>Selanjutnya</Button>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card style={{display:this.state.step[2]}}>
                <CardHeader>Input Data Perusahaan Pemenang</CardHeader>
                <CardBody>
                  <Row>
                    <Col xl={12} lg={12} md={12}>
                      <FormGroup row>
                        <Label for="namaPerusahaan" sm={3}>
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
                        <Label for="alamatPerusahaan" sm={3}>
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
                        <Label for="namaDirektur" sm={3}>
                          Nama Penandatangan
                        </Label>
                        <Col sm={6}>
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
                        <Label for="jabatan" sm={3}>
                          Jabatan
                        </Label>
                        <Col sm={6}>
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
                        <Label for="npwpPerusahaan" sm={3}>
                          NPWP
                        </Label>
                        <Col sm={6}>
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
                      <FormGroup tag="fieldset" row>
                        <Label for="LSorNon" sm={3}>
                          LS / GU / TUP
                        </Label>
                        <Col sm={6}>
                          <FormGroup check>
                            <Label check>
                              <Input id="rdLS" onChange={()=>{
                                this.setState({message_step1_3:'',togleLS:false});
                                
                                }} type="radio" name="radio_LS" value="LS" /> LS
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input id="rdNonLS" onChange={()=>{
                                  this.setState({message_step1_3:'',msg_p6:'',msg_p7:'',msg_p8:'',togleLS:true});
                                  
                                  }} type="radio" name="radio_LS" value="NonLS" /> GU / TUP
                            </Label>
                          </FormGroup>
                          <FormText color={'danger'}>{this.state.message_step1_3}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="namaRek" sm={3}>
                          Nama Rekening Perusahaan
                        </Label>
                        <Col sm={6}>
                          <Input
                            disabled={this.state.togleLS}
                            type="text"
                            name="namaRek"
                            id="namaRek"
                            placeholder="nama rekening, cth : Buana Subur Lestari PT"
                            onChange={this.handleInputChange}
                            //maxLength="5"
                          />
                          <FormText color={'danger'}>{this.state.msg_p6}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="noRek" sm={3}>
                          Nomor Rekening
                        </Label>
                        <Col sm={6}>
                          <Input
                            disabled={this.state.togleLS}
                            type="text"
                            name="noRek"
                            id="noRek"
                            placeholder="nomor rekening"
                            onChange={this.handleInputChange}
                            //maxLength="5"
                          />
                          <FormText color={'danger'}>{this.state.msg_p7}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="bankRek" sm={3}>
                          {"Bank & Cabang"}
                        </Label>
                        <Col sm={6}>
                          <Input
                            disabled={this.state.togleLS}
                            type="text"
                            name="bankRek"
                            id="bankRek"
                            placeholder="nama bank. cth : BCA KCU Bumi Serpong Damai"
                            onChange={this.handleInputChange}
                            //maxLength="5"
                          />
                          <FormText color={'danger'}>{this.state.msg_p8}</FormText>
                        </Col>
                      </FormGroup>
                    </Col>
                    
                    <Col xl={12} lg={12} md={12} style={{display:this.hidePembanding(this.props.tipe)}}>
                    <hr/>
                      <CardHeader>Perusahaan Pembanding (Optional) &nbsp;&nbsp;&nbsp;
                        <Button size="sm"
                          onClick={()=>{
                            var temp = this.state.toglehidePmb;
                            this.setState({toglehidePmb: !temp});
                          }}
                        >{this.state.toglehidePmb?'Show':'Hide'}</Button>
                      </CardHeader>
                      <CardBody style={{
                        display:this.hideOptional(this.state.toglehidePmb) 
                      }}>
                        <FormGroup row>
                          <Label for="namaPerusahaanPembanding1" sm={3}>
                            Nama Perusahaan Pembanding 1
                          </Label> 
                          <Col sm={7}>
                            <Input
                              type="text"
                              name="namaPerusahaanPembanding1"
                              id="namaPerusahaanPembanding1"
                              placeholder="nama perusahaan"
                              onChange={this.handleInputChange}
                              //onKeyUp={()=>{this.handleSearchPerusahaan()}}
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="alamatPerusahaanPembanding1" sm={3}>
                            Alamat Perusahaan Pembanding 1
                          </Label>
                          <Col sm={7}>
                            <Input
                              style={{height:'160px'}}
                              type="textarea"
                              name="alamatPerusahaanPembanding1"
                              id="alamatPerusahaanPembanding1"
                              placeholder="alamat perusahaan"
                              onChange={this.handleInputChange}
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="namaDirekturPembanding1" sm={3}>
                            Nama Penandatangan Pembanding 1
                          </Label> 
                          <Col sm={7}>
                            <Input
                              type="text"
                              name="namaDirekturPembanding1"
                              id="namaDirekturPembanding1"
                              placeholder="nama direktur perusahaan pembanding 1"
                              onChange={this.handleInputChange}
                              //onKeyUp={()=>{this.handleSearchPerusahaan()}}
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="jabatanPmb1" sm={3}>
                            Jabatan Penandatangan Pembanding 1
                          </Label> 
                          <Col sm={7}>
                            <Input
                              type="text"
                              name="jabatanPmb1"
                              id="jabatanPmb1"
                              placeholder="jabatan penandatangan perusahaan pembanding 1"
                              onChange={this.handleInputChange}
                              //onKeyUp={()=>{this.handleSearchPerusahaan()}}
                            />
                          </Col>
                        </FormGroup>
                        <hr/>
                        <FormGroup row>
                          <Label for="namaPerusahaanPembanding2" sm={3}>
                            Nama Perusahaan Pembanding 2
                          </Label> 
                          <Col sm={7}>
                            <Input
                              type="text"
                              name="namaPerusahaanPembanding2"
                              id="namaPerusahaanPembanding2"
                              placeholder="nama perusahaan"
                              onChange={this.handleInputChange}
                              //onKeyUp={()=>{this.handleSearchPerusahaan()}}
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="alamatPerusahaanPembanding2" sm={3}>
                            Alamat Perusahaan Pembanding 2
                          </Label>
                          <Col sm={7}>
                            <Input
                              style={{height:'160px'}}
                              type="textarea"
                              name="alamatPerusahaanPembanding2"
                              id="alamatPerusahaanPembanding2"
                              placeholder="alamat perusahaan"
                              onChange={this.handleInputChange}
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="namaDirekturPembanding2" sm={3}>
                            Nama Direktur Pembanding 2
                          </Label> 
                          <Col sm={7}>
                            <Input
                              type="text"
                              name="namaDirekturPembanding2"
                              id="namaDirekturPembanding2"
                              placeholder="nama direktur perusahaan pembanding 2"
                              onChange={this.handleInputChange}
                              //onKeyUp={()=>{this.handleSearchPerusahaan()}}
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="jabatanPmb2" sm={3}>
                            Jabatan Penandatangan Pembanding 2
                          </Label> 
                          <Col sm={7}>
                            <Input
                              type="text"
                              name="jabatanPmb2"
                              id="jabatanPmb2"
                              placeholder="jabatan penandatangan perusahaan pembanding 2"
                              onChange={this.handleInputChange}
                              //onKeyUp={()=>{this.handleSearchPerusahaan()}}
                            />
                          </Col>
                        </FormGroup>
                      </CardBody>
                    </Col>
                    
                    <Col xl={12} lg={12} md={12}>
                      <FormGroup row className="d-flex justify-content-end">
                        <Col sm={3} className="d-flex justify-content-end">
                          <Button color="danger" onClick={()=>this.handleNext(1)}>Kembali</Button> &nbsp;
                          {/* {this.renderBtnSaveDraft()} &nbsp; */}
                          <Button color="primary" onClick={()=> this.handleNext(3)}>Selanjutnya</Button>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card style={{display:this.state.step[3]}}>
                <CardHeader>BERITA ACARA EVALUASI, KLARIFIKASI, DAN NEGOSIASI</CardHeader>
                <CardBody>
                  <Row>
                    <Col xl={12} lg={12} md={12}>
                      <FormGroup row>
                        <Label for="hrgtotalPNW" sm={3}>
                          Harga Penawaran
                        </Label>
                        <Col sm={4}>
                          <NumberFormat
                            className="form-control"
                            id={"hrgtotalPNW"} name={"hrgtotalPNW"}
                            thousandSeparator={true} 
                            prefix={'Rp. '} 
                            value={this.state.hrgtotalPNW}
                            onValueChange={(values) => {
                                const { formattedValue, value } = values;
                                dataKontrak.hrgtotalPNW = value;
                                this.setState({ hrgtotalPNW: value });
                            }}
                            />
                          <FormText color={'danger'}>{this.state.msg_p1}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="hrgtotal" sm={3}>
                          Harga SPK
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
                                dataKontrak.hrgtotal = value;
                                this.setState({ hrgtotal: value });
                            }}
                            />
                          <FormText color={'danger'}>{this.state.msg_p1}</FormText>
                        </Col>
                      </FormGroup>
                      <hr/>
                    </Col>
                    <Col xl={12} lg={12} md={12}>
                      <Table style={{fontSize:14}} size="sm" responsive {...{ ['' || 'default']: true }}>
                          <thead>
                              <tr>
                              <th>No</th>
                              <th>Uraian Negosiasi dan Klarifikasi</th>
                              <th>Hasil Negosiasi</th>
                              <th style={{width:"140px"}}>Action</th>
                              
                              </tr>
                          </thead>
                          <tbody>
                              {this.state.dataRenderNegosiasi.map((dt,index)=>(
                              <tr style={{backgroundColor:(index%2==0)?"#eff4fc":"#fff", height:60}} key={index}>
                                  <td scope="row" style={{width:50}}>{index+1}</td>
                                  <td style={{width:400}}>
                                    <Input
                                      style={{height:'100px'}}
                                      type="textarea"
                                      name="uraianNego"
                                      id="uraianNego"
                                      placeholder="Item / nama pekerjaan yang dinegosiasi"
                                      value={this.state.dataRenderNegosiasi[index].uraianNego}
                                      onChange={(v)=>{
                                        dataNegosiasi[index].uraianNego = v.target.value;
                                        this.setState({ dataRenderNegosiasi: dataNegosiasi });
                                      }}
                                      //onKeyUp={()=>{this.handleSearchPerusahaan()}}
                                    />
                                  </td>
                                  <td style={{width:400}}>
                                    <Input
                                      style={{height:'100px'}}
                                      type="textarea"
                                      name="hasilNego"
                                      id="hasilNego"
                                      placeholder=""
                                      value={this.state.dataRenderNegosiasi[index].hasilNego}
                                      onChange={(v)=>{
                                        dataNegosiasi[index].hasilNego = v.target.value;
                                        this.setState({ dataRenderNegosiasi: dataNegosiasi });
                                      }}
                                      //onKeyUp={()=>{this.handleSearchPerusahaan()}}
                                    />
                                  </td>
                                  {/* <td style={{width:250}}>
                                      <NumberFormat
                                          className="form-control"
                                          id={"nominal"} name={"nominal"}
                                          thousandSeparator={true} 
                                          prefix={'Rp. '} 
                                          value={dt.nominal==undefined?'':dt.nominal}
                                          onValueChange={(values) => {
                                              const { formattedValue, value } = values;
                                              dataNegosiasi[index].nominal = value;
                                              this.setState({ dataRenderNegosiasi: dataPerjadin, editNominal: true });
                                          }}
                                      />
                                      
                                  </td> */}
                                  <td>                                                           
                                  {index!==0?
                                    <Button 
                                        title="Hapus Item"
                                        style={{background:'rgb(230 14 20)', borderColor:'rgb(230 14 20)'}}
                                        onClick={()=>{
                                            dataNegosiasi.splice(index,1);
                                            this.setState({dataRenderNegosiasi:dataNegosiasi})
                                        }}
                                        size="sm"
                                    ><MdDelete/></Button>:null
                                  }
                                  &nbsp;  
                                  {index==dataNegosiasi.length - 1 ?
                                  <Button 
                                      title="Tambah item"
                                      color="primary"
                                      //style={{background:'rgb(230 14 20)', borderColor:'rgb(230 14 20)'}}
                                      onClick={()=>{
                                          dataNegosiasi.push({uraianNego:"",hasilNego:"Ada perubahan harga, semula Rp xxx.xxx,- menjadi Rp. xxx.xxx,-"});
                                          this.setState({dataRenderNegosiasi:dataNegosiasi});
                                          //console.log(this.state.dataRenderNegosiasi)
                                      }}
                                      size="sm"
                                  ><MdAdd/></Button>:null
                                  }              
                                  </td>
                              </tr>
                              ))}
                          </tbody>
                        </Table>
                        <hr/>
                      </Col>
                    

                    <Col xl={12} lg={12} md={12}>
                      <FormGroup row className="d-flex justify-content-end">
                        <Col sm={4} className="d-flex justify-content-end">
                          <Button color="danger" onClick={()=>this.handleNext(2)}>Kembali</Button> &nbsp;
                          {/* {this.renderBtnSaveDraft()} &nbsp; */}
                          {this.isUp200()?<Button disabled={this.state.overNilai} color="primary" onClick={()=> this.handleNext(4)}>Selanjutnya</Button>:
                            <Button 
                              //disabled={val == '' ? true:false}
                              color="success" 
                              onClick={()=>{
                                this.handleSubmit("save");
                              }}
                              >
                                Simpan
                            </Button>
                          }
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>





              <Card style={{display:this.state.step[4]}}>
                <CardHeader>Input Data Pokja</CardHeader>
                <CardBody>
                  <Row>
                    <Col xl={12} lg={12} md={12}>
                      <FormGroup row>
                        <Label for="namaGroupPokja" sm={3}>
                          Nama Grup Pokja
                        </Label>
                        <Col sm={9}>
                          <Input
                            type="text"
                            name="namaGroupPokja"
                            id="namaGroupPokja"
                            placeholder="nama grup pokja"
                            onChange={this.handleInputChange}
                            //onKeyUp={()=>{this.handleSearchPerusahaan()}}
                          />
                          <FormText color={'danger'}>{this.state.msg_pkj1}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="pokja1" sm={3}>
                          Nama Pokja 1
                        </Label>
                        <Col sm={6}>
                          <Input
                            //style={{height:'160px'}}
                            type="text"
                            name="pokja1"
                            id="pokja1"
                            placeholder="nama anggota pokja 1"
                            onChange={this.handleInputChange}
                          />
                          <FormText color={'danger'}>{this.state.msg_pkj2}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="pokja2" sm={3}>
                          Nama Pokja 2
                        </Label>
                        <Col sm={6}>
                          <Input
                            //style={{height:'160px'}}
                            type="text"
                            name="pokja2"
                            id="pokja2"
                            placeholder="nama anggota pokja 2"
                            onChange={this.handleInputChange}
                          />
                          <FormText color={'danger'}>{this.state.msg_pkj3}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="pokja3" sm={3}>
                          Nama Pokja 3
                        </Label>
                        <Col sm={6}>
                          <Input
                            //style={{height:'160px'}}
                            type="text"
                            name="pokja3"
                            id="pokja3"
                            placeholder="nama anggota pokja 3"
                            onChange={this.handleInputChange}
                          />
                          <FormText color={'danger'}>{this.state.msg_pkj4}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="pokja4" sm={3}>
                          Nama Pokja 4
                        </Label>
                        <Col sm={6}>
                          <Input
                            //style={{height:'160px'}}
                            type="text"
                            name="pokja4"
                            id="pokja4"
                            placeholder="nama anggota pokja 4"
                            onChange={this.handleInputChange}
                          />
                          <FormText color={'danger'}>{this.state.msg_pkj5}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="pokja5" sm={3}>
                          Nama Pokja 5
                        </Label>
                        <Col sm={6}>
                          <Input
                            //style={{height:'160px'}}
                            type="text"
                            name="pokja5"
                            id="pokja5"
                            placeholder="nama anggota pokja 5"
                            onChange={this.handleInputChange}
                          />
                          <FormText color={'danger'}>{this.state.msg_pkj6}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="nipPokja1" sm={3}>
                          NIP Pokja 1
                        </Label>
                        <Col sm={6}>
                          <Input
                            //style={{height:'160px'}}
                            type="text"
                            name="nipPokja1"
                            id="nipPokja1"
                            placeholder="NIP pokja 1"
                            onChange={this.handleInputChange}
                          />
                          <FormText color={'danger'}>{this.state.msg_pkj7}</FormText>
                        </Col>
                      </FormGroup>
                    </Col>
                    <hr/>
                    <Col xl={12} lg={12} md={12}>
                      <FormGroup row>
                        <Col sm={{ offset: 8 }}>
                          <Button color="danger" onClick={()=>this.handleNext(4)}>Kembali</Button> &nbsp;
                          {this.renderBtnSaveDraft()}
                          {/* <Button color="secondary" onClick={()=> this.handleSubmit("generate")}>Unduh DOCX</Button> */}
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>


              

              
              </Form>
            {/* </CardBody>
          </Card> */}
          </Col>
          </Row>
      </Page>
      </header>
    );
  }//endof render
  handleImportdataFormHPS(){
    tblPenampung = tableHPS.slice(); 
    tablePnwrn = tblPenampung.slice();
    this.setState({TABELPnw: tblPenampung});
    dataKontrak.TABELPnw = tblPenampung;
    this.hitungTotal();
  }
  renderBtnSaveDraft(){
    var val = this.state.stateBtnSave;
    return(
        <Button 
          //disabled={val == '' ? true:false}
          color="success" 
          onClick={()=>{
            this.handleSubmit("save");
          }}
          >
            Simpan
        </Button>
    );
  }
  handleEditRowHPS(idx, flag="Pnw"){
    var dr = (flag=="HPS")?tableHPS[idx]:tablePnwrn[idx];
    console.log(dataKontrak);
    if(flag=="HPS"){
      document.getElementById('descr').value = dr.descr;
      document.getElementById('qty').value = dr.qty;
      document.getElementById('freq').value = dr.freq;
      document.getElementById('unitprice').value = removeComma(dr.unitprice);
      document.getElementById('total').value = removeComma(dr.total);
  
      dataKontrak.descr = dr.descr;
      dataKontrak.qty = dr.qty;
      dataKontrak.freq = dr.freq;
      dataKontrak.unitprice = removeComma(dr.unitprice);
      dataKontrak.total = removeComma(dr.total);
      this.setState({isEditHPS:true,indexEditHPS:idx});
    }else{
      document.getElementById('descrPnw').value = dr.descr;
      document.getElementById('qtyPnw').value = dr.qty;
      document.getElementById('freqPnw').value = dr.freq;
      document.getElementById('unitpricePnw').value = removeComma(dr.unitprice);
      document.getElementById('totalPnw').value = removeComma(dr.total);
  
      dataKontrak.descrPnw = dr.descr;
      dataKontrak.qtyPnw = dr.qty;
      dataKontrak.freqPnw = dr.freq;
      dataKontrak.unitpricePnw = removeComma(dr.unitprice);
      dataKontrak.totalPnw = removeComma(dr.total);
      this.setState({isEditPnw:true,indexEditPnw:idx});
    }
    
    
  }
  handleAddHPS(flag="Pnw"){
    console.log(dataKontrak);
    var descr;
    var qty;
    var freq;
    var unitprice;
    var total;

    if(flag=="HPS"){
      var cFalse = 0;
      if(dataKontrak.descr == ''){
        cFalse++;
        this.setState({msg_tb1:'Harus diisi!'});
      }
      if(dataKontrak.qty == ''){
        cFalse++;
        this.setState({msg_tb2:'Harus diisi!'});
      }
      if(dataKontrak.freq == ''){
        cFalse++;
        this.setState({msg_tb3:'Harus diisi!'});
      }
      if(dataKontrak.unitprice == ''){
        cFalse++;
        this.setState({msg_tb4:'Harus diisi!'});
      }
      if(cFalse>0){
        return;
      }

      descr = dataKontrak.descr;
      qty = dataKontrak.qty;
      freq = dataKontrak.freq;
      unitprice = dataKontrak.unitprice;
      total = dataKontrak.total;
    }else{
      var cFalse = 0;
      if(dataKontrak.descrPnw == '' || dataKontrak.descrPnw == undefined){
        cFalse++;
        this.setState({msg_tb1:'Harus diisi!'});
      }
      if(dataKontrak.qtyPnw == ''  || dataKontrak.qtyPnw == undefined){
        cFalse++;
        this.setState({msg_tb2:'Harus diisi!'});
      }
      if(dataKontrak.freqPnw == '' || dataKontrak.freqPnw == undefined){
        cFalse++;
        this.setState({msg_tb3:'Harus diisi!'});
      }
      if(dataKontrak.unitpricePnw == '' || dataKontrak.unitpricePnw == undefined){
        cFalse++;
        this.setState({msg_tb4:'Harus diisi!'});
      }
      if(cFalse>0){
        return;
      }

      descr = dataKontrak.descrPnw;
      qty = dataKontrak.qtyPnw;
      freq = dataKontrak.freqPnw;
      unitprice = dataKontrak.unitpricePnw;
      total = dataKontrak.totalPnw;
      console.log(dataKontrak.unitpricePnw);
    }

    var rowHPS = {
      descr: descr,
      qty: qty,
      freq: freq,
      unitprice: commafy(unitprice),
      total: commafy(total),
    }

    console.log("iseditHPS:" + this.state.isEditHPS + " iseditPNW: " + this.state.isEditPnw)
    if(this.state.isEditHPS && flag=="HPS"){
      console.log("masuk edit hps");
      tableHPS[this.state.indexEditHPS] = rowHPS;
      this.setState({isEditHPS:false});
    }
    else if(this.state.isEditPnw && flag=="Pnw"){
      console.log("masuk edit pnw");
      tablePnwrn[this.state.indexEditPnw] = rowHPS;
      this.setState({isEditPnw:false});
    }
    else{
      if(flag=="HPS"){
        tableHPS.push(rowHPS);
      }else{
        tablePnwrn.push(rowHPS);
      }
    }
    
    if(flag=="HPS"){
      console.log("masuk flag HPS");
      this.setState({TABEL: tableHPS});
      dataKontrak.TABEL = tableHPS;
    }else if(flag=="Pnw"){
      console.log("masuk flag PNW");
      this.setState({TABELPnw: tablePnwrn});
      dataKontrak.TABELPnw = tablePnwrn;
    }
    this.hitungTotal(flag);
    dataKontrak.descr = '';
    dataKontrak.qty = '';
    dataKontrak.freq = '';
    dataKontrak.unitprice = '';
    dataKontrak.total = '';  
    document.getElementById('descr').value = '';
    document.getElementById('qty').value = '';
    document.getElementById('freq').value = '';
    document.getElementById('unitprice').value = '';
    document.getElementById('total').value = '';
    dataKontrak.descrPnw = '';
    dataKontrak.qtyPnw = '';
    dataKontrak.freqPnw = '';
    dataKontrak.unitpricePnw = '';
    dataKontrak.totalPnw = '';  
    document.getElementById('descrPnw').value = '';
    document.getElementById('qtyPnw').value = '';
    document.getElementById('freqPnw').value = '';
    document.getElementById('unitpricePnw').value = '';
    document.getElementById('totalPnw').value = '';
    console.log(dataKontrak);
  }

  handelDeleteRowHPS(index,flag="Pnw"){
    if(flag=="HPS"){
      tableHPS.splice(index,1);
      this.setState({TABEL:tableHPS})
      dataKontrak.TABEL = tableHPS;
    }else{
      tablePnwrn.splice(index,1);
      this.setState({TABELPnw:tablePnwrn})
      dataKontrak.TABELPnw = tablePnwrn;
    }
    
    this.hitungTotal(flag);
  }
  cekNominalKontrak(flag="Pnw"){
    var grandtotal = flag=="HPS"?this.state.hrgtotalHPS:this.state.hrgtotal;
    var batasMaks = 0;
    var type = this.state.tipe;
    if(type == '100up' || type == '200up'){
      return;
    }

    if(type == '50200NonPL' || type == '50200PL'){
      batasMaks = 200000000;
    }else if(type == '100NonPL' || type == '100PL'){
      batasMaks = 100000000;
    }
    if(grandtotal > batasMaks){
      // if (!this.notificationSystem) {
      //   return;
      // }
      this.notificationSystem.addNotification({
        title: <MdWarning />,
        message: 'Total Kontrak Melebihi Batas',
        level: 'error',
      });
      setTimeout(() => {
        this.notificationSystem.addNotification({
          title: <MdWarning />,
          message: 'Batas maksimum yaitu ' + commafy(batasMaks),
          level: 'error',
        });
      }, 1000); 
      
      this.setState({overNilai:true});
      // if(flag=="HPS"){
      //   var idx = this.state.TABEL.length;
      // }else{
      //   var idx = this.state.TABELPnw.length;
      // }
      // this.handelDeleteRowHPS(idx-1,flag);
    }else{
      this.setState({overNilai:false});
    }
  }
  hitungTotal(flag="Pnw"){
    var subtot = 0;
    //console.log(tableHPS);
    if(flag=="HPS"){
      tableHPS.map((d)=>{
        subtot += parseInt(removeComma(d.total));
      })
  
      var preppn = Math.ceil(subtot * (0.1));
      var preMgmtFee = Math.ceil(subtot * (dataKontrak.managementFeePctg/100));
      var mgmtFee = this.state.isPctgMgmtFee == 1 ? preMgmtFee : parseInt(dataKontrak.mgmtFeeNmnl||0);
      var isMgt = this.state.isManagementFee;
      var isppn = this.state.isPPN;
      var ppn = isMgt?Math.ceil((subtot+mgmtFee)*0.1):preppn;
      var hrgtotal = subtot + (isppn?ppn:0) + (isMgt?mgmtFee:0);
  
      this.setState({
        subtotalHPS: subtot,
        ppnHPS: ppn,
        managementFeeHPS: mgmtFee,
        hrgtotalHPS: hrgtotal
      },()=>{this.cekNominalKontrak(flag);})
  
      dataKontrak.subtotalHPS = subtot;
      dataKontrak.ppnHPS = ppn;
      dataKontrak.hrgtotalHPS = hrgtotal;
      dataKontrak.managementFeeHPS = mgmtFee;
    }else{
      tablePnwrn.map((d)=>{
        subtot += parseInt(removeComma(d.total));
      })
  
      var preppn = Math.ceil(subtot * (0.1));
      var preMgmtFee = Math.ceil(subtot * (dataKontrak.managementFeePctgPnw/100));
      var mgmtFee = this.state.isPctgMgmtFeePnw == 1 ? preMgmtFee : parseInt(dataKontrak.mgmtFeeNmnlPnw||0);
      var isMgt = this.state.isManagementFeePnw;
      var isppn = this.state.isPPNPnw;
      var ppn = isMgt?Math.ceil((subtot+mgmtFee)*0.1):preppn;
      var hrgtotal = subtot + (isppn?ppn:0) + (isMgt?mgmtFee:0);
  
      this.setState({
        subtotal: subtot,
        ppn: ppn,
        managementFee: mgmtFee,
        hrgtotal: hrgtotal
      },()=>{this.cekNominalKontrak(flag);})
  
      dataKontrak.subtotal = subtot;
      dataKontrak.ppn = ppn;
      dataKontrak.hrgtotal = hrgtotal;
      dataKontrak.managementFee = mgmtFee;
    }
  }
};
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
function removeComma(num){
  return num.replace(/,/g, '');
}
function setTabelNego(dtTabel){
  var tblFIX = [];
  dtTabel.map((d,index)=>{
    var row = {
      no: index+1,
      uraianNego: d.uraian_nego,
      hasilNego: d.hasil_nego,
    }
    tblFIX.push(row);
  })

  return tblFIX;
}
export default Form50200;
