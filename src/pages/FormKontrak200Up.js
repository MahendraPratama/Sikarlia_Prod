import Page from 'components/Page';
import React from 'react';
import {generateDocument} from '../docxtemplater/engine';
import {pushKontrak} from '../server/API';
import { Stepper, Step } from 'react-form-stepper';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import {
  MdDelete,MdCloudUpload,MdWarning,MdEdit
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
var tableHPS = [];
const urlFile= 'https://drive.google.com/u/0/uc?id=15uCHB-w4Xhz-pQAqwBzcil3AoRZB7f6U&export=download';
const path = window.location.origin  + '/kontrak50_200.docx';
const urlLocal = 'https://localhost/docxtemplate/kontrak50_200.docx';
var dataKontrak = {
  userid:localStorage.getItem("user_session"),
  unique_id:null,
  id:null,
  namaPekerjaan: null,
  suratPermintaanPPK: '0000-00-00',
  pengadaanBarJas:'0000-00-00',
  HPS:'0000-00-00',
  penawaranRKS:'0000-00-00',
  pengajuanPenawaran:'0000-00-00',
  undanganEvaluasi:'0000-00-00',
  evaluasi:'0000-00-00',
  penetapanPenyedia:'0000-00-00',
  laporanPelaksanaan:'0000-00-00',
  suratPemesanan:'0000-00-00',
  penandatangananKontrak:'0000-00-00',
  pelaksanaanPekerjaan:0,
  penyelesaianPekerjaan:'0000-00-00',
  pembayaran:'0000-00-00',
  namaPerusahaan:null,
  alamatPerusahaan:null,
  namaDirektur:null,
  npwpPerusahaan:null,
  
  descr:'',
  qty:'',
  freq:'',
  unitprice:'',
  total:'',
  managementFee:0,

  subtotal:0,
  ppn:0,
  hrgtotal:0,

  TABEL:[],
  managementFeePctg:0,
  cb_managementFee:false,
  
  suratKesanggupan:'0000-00-00',	
  namaGroupPokja:null,
  pokja1:null,				
  pokja2:null,				
  pokja3:null,				
  pokja4:null,				
  pokja5:null,				
  nipPokja1:null,			
  jabatan:"Direktur Utama",			

  tipeKontrak:'200up',
}
class Form200Up extends React.Component {
  constructor(props){
    super(props)
    this.state = {
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
        ],
        stateBtnSave:'',
        message_step1: '',
        activeStep:0,
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
        msg_j15:'',

        j2:true,
        j3:true,
        j4:true,
        j5:true,
        j6:true,
        j7:true,
        j8:true,
        j9:true,
        j10:true,
        j11:true,
        j12:false,
        j13:true,
        j14:true,
        j15:true,

        msg_tb1:'',
        msg_tb2:'',
        msg_tb3:'',
        msg_tb4:'',
        msg_tb5:'',
        TABEL:[],

        subtotal:0,
        ppn:0,
        managementFee:0,
        hrgtotal:0,

        msg_p1:'',
        msg_p2:'',
        msg_p3:'',
        msg_p4:'',

        validasiJadwal:false,
        dataPerusahaan:[],
        hideChooser: true,
        isManagementFee:false,

        isEditHPS:false,
        indexEditHPS:null,
        
    };
    //this.handleNext = this.handleNext.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  componentWillUnmount(){
    dataKontrak = {
      userid:localStorage.getItem("user_session"),
      unique_id:null,
      id:null,
      namaPekerjaan: null,
      suratPermintaanPPK: '0000-00-00',
      pengadaanBarJas:'0000-00-00',
      HPS:'0000-00-00',
      penawaranRKS:'0000-00-00',
      pengajuanPenawaran:'0000-00-00',
      undanganEvaluasi:'0000-00-00',
      evaluasi:'0000-00-00',
      penetapanPenyedia:'0000-00-00',
      laporanPelaksanaan:'0000-00-00',
      suratPemesanan:'0000-00-00',
      penandatangananKontrak:'0000-00-00',
      pelaksanaanPekerjaan:0,
      penyelesaianPekerjaan:'0000-00-00',
      pembayaran:'0000-00-00',
      namaPerusahaan:null,
      alamatPerusahaan:null,
      namaDirektur:null,
      npwpPerusahaan:null,
      
      descr:'',
      qty:'',
      freq:'',
      unitprice:'',
      total:'',
      managementFee:0,
    
      subtotal:0,
      ppn:0,
      hrgtotal:0,
    
      TABEL:[],
      managementFeePctg:0,
      cb_managementFee:false,
      
      suratKesanggupan:'0000-00-00',	
      namaGroupPokja:null,
      pokja1:null,				
      pokja2:null,				
      pokja3:null,				
      pokja4:null,				
      pokja5:null,				
      nipPokja1:null,			
      jabatan:"Direktur Utama",			
    
      tipeKontrak:'200up',
    };
  }
  componentDidMount(){
    const {data} = this.props.location;
    if(!data){
      return;
    }

    dataKontrak.id                    = data.id
    dataKontrak.unique_id             = data.unique_id
    dataKontrak.namaPekerjaan         = data.namaPekerjaan
    dataKontrak.suratPermintaanPPK    = data.suratPermintaanPPK !='0000-00-00' ? data.suratPermintaanPPK : null
    dataKontrak.pengadaanBarJas       = data.pengadaanBarJas !='0000-00-00' ? data.pengadaanBarJas : null
    dataKontrak.HPS                   = data.HPS !='0000-00-00' ? data.HPS : null
    dataKontrak.penawaranRKS          = data.penawaranRKS !='0000-00-00' ? data.penawaranRKS : null
    dataKontrak.pengajuanPenawaran    = data.pengajuanPenawaran !='0000-00-00' ? data.pengajuanPenawaran : null
    dataKontrak.undanganEvaluasi      = data.undanganEvaluasi !='0000-00-00' ? data.undanganEvaluasi : null
    dataKontrak.evaluasi              = data.evaluasi !='0000-00-00' ? data.evaluasi : null
    dataKontrak.penetapanPenyedia     = data.penetapanPenyedia !='0000-00-00' ? data.penetapanPenyedia : null
    dataKontrak.laporanPelaksanaan    = data.laporanPelaksanaan !='0000-00-00' ? data.laporanPelaksanaan : null
    dataKontrak.suratPemesanan        = data.suratPemesanan !='0000-00-00' ? data.suratPemesanan : null
    dataKontrak.penandatangananKontrak= data.penandatangananKontrak !='0000-00-00' ? data.penandatangananKontrak : null
    dataKontrak.pelaksanaanPekerjaan  = data.pelaksanaanPekerjaan
    dataKontrak.penyelesaianPekerjaan = data.penyelesaianPekerjaan !='0000-00-00' ? data.penyelesaianPekerjaan : null
    dataKontrak.pembayaran            = data.pembayaran !='0000-00-00' ? data.pembayaran : null
    dataKontrak.suratKesanggupan      = data.suratKesanggupan !='0000-00-00' ? data.suratKesanggupan : null
    dataKontrak.namaPerusahaan        = data.namaPerusahaan
    dataKontrak.alamatPerusahaan      = data.alamatPerusahaan
    dataKontrak.namaDirektur          = data.namaDirektur
    dataKontrak.npwpPerusahaan        = data.npwpPerusahaan
    
    dataKontrak.namaGroupPokja        = data.namaGroupPokja
    dataKontrak.pokja1                = data.pokja1
    dataKontrak.pokja2                = data.pokja2
    dataKontrak.pokja3                = data.pokja3
    dataKontrak.pokja4                = data.pokja4
    dataKontrak.pokja5                = data.pokja5
    dataKontrak.nipPokja1             = data.nipPokja1
  
    dataKontrak.hrgtotal              = data.hrgtotal;
    dataKontrak.managementFeePctg     = data.mgmtFeePctg;

    if(data.mgmtFeePctg){
      document.getElementById('managementFeePctg').value = data.mgmtFeePctg;
    }
    document.getElementById('cb_managementFee').checked = data.cb_managementFee == 1 ? true:false;
    this.setState({
      j2   : data.suratPermintaanPPK!='0000-00-00'?false:true,
      j3   : data.pengadaanBarJas!='0000-00-00'?false:true,
      j4   : data.HPS!='0000-00-00'?false:true,
      j5   : data.penawaranRKS!='0000-00-00'?false:true,
      j6   : data.pengajuanPenawaran!='0000-00-00'?false:true,
      j7   : data.undanganEvaluasi!='0000-00-00'?false:true,
      j8   : data.evaluasi!='0000-00-00'?false:true,
      j15  : data.penetapanPenyedia!='0000-00-00'?false:true,
      j10  : data.laporanPelaksanaan!='0000-00-00'?false:true,
      j11  : data.suratPemesanan!='0000-00-00'?false:true,
      j13  : data.penandatangananKontrak!='0000-00-00'?false:true,
      j14  : data.penyelesaianPekerjaan!='0000-00-00'?false:true,
      //j14  : data.pembayaran!='0000-00-00'?false:true,
      j9  : data.suratKesanggupan!='0000-00-00'?false:true,

      validasiJadwal  : data.pembayaran!='0000-00-00'?true:false,
      isManagementFee: data.cb_managementFee == 1 ? true:false,
    })
    // this.validateStepTgl("suratPermintaanPPK");
    // this.validateStepTgl("pengadaanBarJas");
    // this.validateStepTgl("HPS");
    // this.validateStepTgl("penawaranRKS");
    // this.validateStepTgl("pengajuanPenawaran");
    // this.validateStepTgl("undanganEvaluasi");
    // this.validateStepTgl("evaluasi");
    // this.validateStepTgl("penetapanPenyedia");
    // this.validateStepTgl("laporanPelaksanaan");
    // this.validateStepTgl("suratPemesanan");
    // this.validateStepTgl("penandatangananKontrak");
    // this.validateStepTgl("penyelesaianPekerjaan");
    // this.validateStepTgl("pembayaran");

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
    document.getElementById("suratKesanggupan").value       = data.suratKesanggupan;
    document.getElementById("namaPerusahaan").value         = data.namaPerusahaan;
    document.getElementById("alamatPerusahaan").value       = data.alamatPerusahaan;
    document.getElementById("namaDirektur").value           = data.namaDirektur;
    document.getElementById("npwpPerusahaan").value         = data.npwpPerusahaan;

    document.getElementById("namaGroupPokja").value         = data.namaGroupPokja;
    document.getElementById("pokja1").value         = data.pokja1;
    document.getElementById("pokja2").value         = data.pokja2;
    document.getElementById("pokja3").value         = data.pokja3;
    document.getElementById("pokja4").value         = data.pokja4;
    document.getElementById("pokja5").value         = data.pokja5;
    document.getElementById("nipPokja1").value         = data.nipPokja1;

    
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
            dataKontrak.TABEL = dataAPI.data;
            tableHPS = dataAPI.data;
            this.setState({ TABEL: dataAPI.data });
            this.hitungTotal();
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
    if(key=='pelaksanaanPekerjaan'){
      this.validatePelaksanaanPkj(value);
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

    if(key=='cb_managementFee'){
      this.setState({isManagementFee:target.checked}, ()=>{
        this.hitungTotal();
      });
      
    }
    if(key=='managementFeePctg'){
      //var ppn = this.state.subtotal * (0.1);
      this.hitungTotal();
      // var mgmtFee = this.state.subtotal * (value/100);
      // var isMgt = this.state.isManagementFee;
      // var hrgtotal = this.state.subtotal + this.state.ppn + (isMgt?mgmtFee:0);
      // this.setState({managementFee:mgmtFee, hrgtotal:hrgtotal})
    }

    if(key=='qty' || key=='unitprice'){
      var qty = document.getElementById('qty').value || 0;
      var unt = document.getElementById('unitprice').value || 0;

      var tot = qty * unt;
      dataKontrak.total = tot;
      document.getElementById('total').value = tot;
    }
  }
  validatePelaksanaanPkj(durasi){
    if(durasi<1){
      this.setState({msg_j12:"Tidak boleh kurang dari 1"})
      return false;
    }else{
      this.setState({msg_j12:""})
      return true;
    }
  }
  validateStepTgl(key){
    var vldt = true;
    if(dataKontrak.pengadaanBarJas < dataKontrak.suratPermintaanPPK){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j2:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j2:'', validasiJadwal:true}) }
    if(dataKontrak.HPS < dataKontrak.pengadaanBarJas){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j3:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j3:'', validasiJadwal:true}) }
    if(dataKontrak.penawaranRKS < dataKontrak.HPS){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j4:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j4:'', validasiJadwal:true}) }
    if(dataKontrak.pengajuanPenawaran < dataKontrak.penawaranRKS){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j5:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j5:'', validasiJadwal:true}) }
    if(dataKontrak.undanganEvaluasi < dataKontrak.pengajuanPenawaran){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j6:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j6:'', validasiJadwal:true}) }
    if(dataKontrak.evaluasi < dataKontrak.undanganEvaluasi){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j7:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j7:'', validasiJadwal:true}) }
    if(dataKontrak.penetapanPenyedia < dataKontrak.evaluasi){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j8:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j8:'', validasiJadwal:true}) }

    if(dataKontrak.suratKesanggupan < dataKontrak.penetapanPenyedia){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j15:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j15:'', validasiJadwal:true}) }

    if(dataKontrak.laporanPelaksanaan < dataKontrak.suratKesanggupan){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j9:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j9:'', validasiJadwal:true}) }
    if(dataKontrak.suratPemesanan < dataKontrak.laporanPelaksanaan){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j10:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j10:'', validasiJadwal:true}) }
    if(dataKontrak.penandatangananKontrak < dataKontrak.suratPemesanan){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j11:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j11:'', validasiJadwal:true}) }
    if(dataKontrak.penyelesaianPekerjaan < dataKontrak.penandatangananKontrak){
      var msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
      vldt = false;
      this.setState({msg_j13:msg, validasiJadwal:vldt})
    }else{this.setState({msg_j13:'', validasiJadwal:true}) }
    if(dataKontrak.pembayaran < dataKontrak.penyelesaianPekerjaan){
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
      this.setState({j15:false, msg_j8:msg, validasiJadwal:vldt})
    }

    if(key=="suratKesanggupan"){
      var msg = '';
      if(dataKontrak.suratKesanggupan < dataKontrak.penetapanPenyedia){
        msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
        vldt = false;
      }
      this.setState({j9:false, msg_j15:msg, validasiJadwal:vldt})
    }

    if(key=="laporanPelaksanaan"){
      var msg = '';
      if(dataKontrak.laporanPelaksanaan < dataKontrak.suratKesanggupan){
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
      this.setState({j13:false, msg_j11:msg, validasiJadwal:vldt})
    }
    if(key=="penyelesaianPekerjaan"){
      var msg = '';
      if(dataKontrak.penyelesaianPekerjaan < dataKontrak.penandatangananKontrak){
        msg = 'Tanggal yg diinput tidak boleh kurang dari tanggal sebelumnya'
        vldt = false;
      }
      this.setState({j14:false, msg_j13:msg, validasiJadwal:vldt})
    }
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
    console.log(dataKontrak);
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
      generateDocument(dataKontrak,'/kontrak200up.docx');
      return;
    }
    
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
    const temp = ['none','none','none','none','none'];
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
    if(!data.suratPermintaanPPK){
      this.setState({msg_j1: 'Harus diisi !!'});
      cFalse++;
    }
    if(!data.pengadaanBarJas){
      this.setState({msg_j2: 'Harus diisi !!'});
      cFalse++;
    }
    if(!data.HPS){
      this.setState({msg_j3: 'Harus diisi !!'});
      cFalse++;
    }
    if(!data.penawaranRKS){
      this.setState({msg_j4: 'Harus diisi !!'});
      cFalse++;
    }
    if(!data.pengajuanPenawaran){
      this.setState({msg_j5: 'Harus diisi !!'});
      cFalse++;
    }
    if(!data.undanganEvaluasi){
      this.setState({msg_j6: 'Harus diisi !!'});
      cFalse++;
    }
    if(!data.evaluasi){
      this.setState({msg_j7: 'Harus diisi !!'});
      cFalse++;
    }
    if(!data.penetapanPenyedia){
      this.setState({msg_j8: 'Harus diisi !!'});
      cFalse++;
    }
    if(!data.laporanPelaksanaan){
      this.setState({msg_j9: 'Harus diisi !!'});
      cFalse++;
    }
    if(!data.suratPemesanan){
      this.setState({msg_j10: 'Harus diisi !!'});
      cFalse++;
    }
    if(!data.penandatangananKontrak){
      this.setState({msg_j11: 'Harus diisi !!'});
      cFalse++;
    }
    if(!data.pelaksanaanPekerjaan){
      this.setState({msg_j12: 'Harus diisi !!'});
      cFalse++;
    }
    if(!data.penyelesaianPekerjaan){
      this.setState({msg_j13: 'Harus diisi !!'});
      cFalse++;
    }
    if(!data.pembayaran){
      this.setState({msg_j14: 'Harus diisi !!'});
      cFalse++;
    }
    if(!data.suratKesanggupan){
      this.setState({msg_j15: 'Harus diisi !!'});
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
  }
  validation_step3(){
    var data = dataKontrak;
    var cFalse = 0;
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
          document.getElementById('npwpPerusahaan').value = dtChoosed.npwpPerusahaan;

          dataKontrak.namaPerusahaan    = dtChoosed.namaPerusahaan;
          dataKontrak.alamatPerusahaan  = dtChoosed.alamatPerusahaan;
          dataKontrak.namaDirektur      = dtChoosed.namaDirektur;
          dataKontrak.npwpPerusahaan    = dtChoosed.npwpPerusahaan;
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
        breadcrumbs={[{ name: 'Kontrak diatas 200', active: true }]}
      >
        <Row>
          <Col xl={12} lg={12} md={12}>
            <Stepper activeStep={this.state.activeStep}>
              <Step label="Nama Pekerjaan" onClick={()=>{this.handleNext(0)}}/>
              <Step label="Jadwal Pekerjaan" onClick={()=>{this.handleNext(1)}}/>
              <Step label="Perusahaan Pemenang" onClick={()=>{this.handleNext(2)}}/>
              <Step label="Tabel Penawaran" onClick={()=>{this.handleNext(3)}}/>
              <Step label="Pokja" onClick={()=>{this.handleNext(4)}}/>
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
                    </Col>
                    <hr/>
                    <Col xl={12} lg={12} md={12}>
                      <FormGroup row>
                        <Col sm={{ offset: 8 }}>
                          <Button color="danger" onClick={()=>{this.props.history.push('/dashboard')}}>Cancel</Button> &nbsp;
                          {this.renderBtnSaveDraft()} &nbsp;
                          <Button color="primary" onClick={()=> this.handleNext(1)}>Next</Button>
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
                    <Col xl={6} lg={12} md={12}>
                      <FormGroup row>
                        <Label for="suratPermintaanPPK" sm={6}>
                          Surat Permintaan kepada PPK untuk melaksanakan Pengadaan Barang/Jasa
                        </Label>
                        <Col sm={5}>
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
                        <Label for="pengadaanBarJas" sm={6}>
                          Pengadaan Barang dan Jasa
                        </Label>
                        <Col sm={5}>
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
                        <Label for="HPS" sm={6}>
                          HPS
                        </Label>
                        <Col sm={5}>
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
                        <Label for="penawaranRKS" sm={6}>
                          Permintaan Penawaran dilampiri RKS
                        </Label>
                        <Col sm={5}>
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
                        <Label for="pengajuanPenawaran" sm={6}>
                          Pengajuan Penawaran (Dilampiri SIUP, Akte Notaris, NPWP, Bukti Pembayaran pajak Terakhir)
                        </Label>
                        <Col sm={5}>
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
                        <Label for="undanganEvaluasi" sm={6}>
                          {'Undangan Evaluasi Klarifikasi & negosiasi'}
                        </Label>
                        <Col sm={5}>
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
                        <Label for="evaluasi" sm={6}>
                          {"Evaluasi Klarifikasi & negosiasi"}
                        </Label>
                        <Col sm={5}>
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

                    <Col xl={6} lg={12} md={12}>          
                      <FormGroup row>
                        <Label for="penetapanPenyedia" sm={6}>
                          Penetapan Penyedia Barang/Jasa (SPPBJ)
                        </Label>
                        <Col sm={5}>
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
                      <FormGroup row>
                        <Label for="suratKesanggupan" sm={6}>
                          Surat Kesanggupan
                        </Label>
                        <Col sm={5}>
                          <Input
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
                        <Label for="laporanPelaksanaan" sm={6}>
                          Laporan Pelaksanaan Pengadaan Barang dan Jasa
                        </Label>
                        <Col sm={5}>
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
                        <Label for="suratPemesanan" sm={6}>
                          Surat Pemesanan
                        </Label>
                        <Col sm={5}>
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
                        <Label for="penandatangananKontrak" sm={6}>
                          Penandatanganan Kontrak SPK
                        </Label>
                        <Col sm={5}>
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
                        <Label for="pelaksanaanPekerjaan" sm={6}>
                          Pelaksanaan Pekerjaan
                        </Label>
                        <Col sm={3}>
                          <Input
                          disabled={this.state.j12}
                            type="number"
                            name="pelaksanaanPekerjaan"
                            id="pelaksanaanPekerjaan"
                            placeholder="hari kalender"
                            onChange={this.handleInputChange}
                            //onKeyUp={()=>{this.setState({msg_j12:''})}}
                            //onBlur={()=>{this.setState({msg_j12:''})}}
                          />
                          <FormText color={'danger'}>{this.state.msg_j12}</FormText>
                        </Col>
                        <Label sm={3}>
                          hari
                        </Label>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="penyelesaianPekerjaan" sm={6}>
                          BA Penyelesaian Pekerjaan Barang/Jasa
                        </Label>
                        <Col sm={5}>
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
                        <Label for="pembayaran" sm={6}>
                          BA Pembayaran 
                        </Label>
                        <Col sm={5}>
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
                      <FormGroup row>
                        <Col sm={{ offset: 8 }}>
                          <Button color="danger" onClick={()=>this.handleNext(0)}>Back</Button> &nbsp;
                          {this.renderBtnSaveDraft()} &nbsp;
                          <Button color="primary" onClick={()=>this.handleNext(2)}>Next</Button>
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
                        <Col sm={9}>
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
                        <Col sm={9}>
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
                          Nama Direktur
                        </Label>
                        <Col sm={9}>
                          <Input
                            type="text"
                            name="namaDirektur"
                            id="namaDirektur"
                            placeholder="nama direktur"
                            onChange={this.handleInputChange}
                          />
                          <FormText color={'danger'}>{this.state.msg_p3}</FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="npwpPerusahaan" sm={3}>
                          NPWP
                        </Label>
                        <Col sm={9}>
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
                    </Col>
                    <hr/>
                    <Col xl={12} lg={12} md={12}>
                      <FormGroup row>
                        <Col sm={{ offset: 8 }}>
                          <Button color="danger" onClick={()=>this.handleNext(1)}>Back</Button> &nbsp;
                          {this.renderBtnSaveDraft()} &nbsp;
                          <Button color="primary" onClick={()=> this.handleNext(3)}>Next</Button>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card style={{display:this.state.step[3]}}>
                <CardHeader>Input Tabel Penawaran</CardHeader>
                <CardBody>
                  <Row>
                    <Col xl={5} lg={12} md={12}>
                      <FormGroup row>
                        <Label for="descr" sm={3}>
                          Deskripsi
                        </Label>
                        <Col sm={9}>
                          <Input
                            type="textarea"
                            style={{height:'140px'}}
                            id="descr"
                            name="descr"
                            placeholder="uraian kegiatan/barang"
                            onChange={this.handleInputChange}
                            onKeyUp={()=>{this.setState({msg_tb1:''})}}
                          />
                          <FormText color={'danger'}>{this.state.msg_tb1}</FormText>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col xl={7} lg={12} md={12}>
                      <Row>
                        <Col xl={6} lg={12} md={12}>
                          <FormGroup row>
                            <Label for="qty" sm={4}>
                            Jumlah
                            </Label>
                            <Col sm={8}>
                              <Input
                                type="number"
                                id="qty"
                                name="qty"
                                placeholder="jumlah"
                                onChange={this.handleInputChange}
                                onKeyUp={()=>{this.setState({msg_tb2:''})}}
                              />
                              <FormText color={'danger'}>{this.state.msg_tb2}</FormText>
                            </Col>
                          </FormGroup>
                          <FormGroup row>
                            <Label for="freq" sm={4}>
                              Satuan
                            </Label>
                            <Col sm={8}>
                              <Input
                                type="text"
                                id="freq"
                                name="freq"
                                placeholder="paket, bulan, OH, OK, OB, dll"
                                onChange={this.handleInputChange}
                                onKeyUp={()=>{this.setState({msg_tb4:''})}}
                              />
                              <FormText color={'danger'}>{this.state.msg_tb4}</FormText>
                            </Col>
                          </FormGroup>
                          
                        </Col>
                        <Col xl={6} lg={12} md={12}>
                          <FormGroup row>
                            <Label for="unitprice" sm={4}>
                              Harga Satuan
                            </Label>
                            <Col sm={8}>
                              <Input
                                type="number"
                                id="unitprice"
                                name="unitprice"
                                placeholder="harga satuan"
                                onChange={this.handleInputChange}
                                onKeyUp={()=>{this.setState({msg_tb3:''})}}
                              />
                              <FormText color={'danger'}>{this.state.msg_tb3}</FormText>
                            </Col>
                          </FormGroup>
                          <FormGroup row>
                            <Label for="total" sm={4}>
                              Total Harga
                            </Label>
                            <Col sm={8}>
                              <Input
                                type="number"
                                name="total"
                                id="total"
                                placeholder="total harga"
                                onChange={this.handleInputChange}
                                onKeyUp={()=>{this.setState({msg_tb5:''})}}
                              />
                              <FormText color={'danger'}>{this.state.msg_tb5}</FormText>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                    <Col xl={12} lg={12} md={12}>
                      <FormGroup row>
                        <Col sm={{ offset: 11 }}>
                        <Button color="secondary" onClick={()=> this.handleAddHPS()}>{this.state.isEditHPS?"Save":"ADD"}</Button>
                        </Col>
                      </FormGroup>
                    </Col>
                    <hr/>
                    <Col xl={5} lg={12} md={12}>
                      <FormGroup row>
                        <Label for="checkbox2" sm={3}>
                          Optional
                        </Label>
                        <Col sm={{ size: 9 }}>
                          <FormGroup check>
                            <Label check>
                              <Input type="checkbox" id="cb_managementFee" name="cb_managementFee"
                              onChange={this.handleInputChange}
                              /> Management Fee                              
                            </Label>
                          </FormGroup>
                          <InputGroup>
                            <Input
                              type='number'
                              name="managementFeePctg"
                              id="managementFeePctg"
                              onChange={this.handleInputChange}
                            />
                            <InputGroupAddon addonType="append">%</InputGroupAddon>
                          </InputGroup>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col xl={12} lg={12} md={12}>
                      <Card body>
                        <Table responsive {...{ ['hover' || 'default']: true }}>
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>Deskripsi</th>
                              <th>Jumlah</th>
                              <th>Satuan</th>
                              <th align="right">Harga Satuan</th>
                              <th align="right">Total Harga</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.TABEL.map((dt,index)=>(
                              <tr key={index}>
                                <td scope="row">{index+1}</td>
                                <td>{dt.descr}</td>
                                <td>{dt.qty}</td>
                                <td>{dt.freq}</td>
                                <td align="right">{dt.unitprice}</td>
                                <td align="right">{dt.total}</td>
                                <td>
                                  <Button 
                                    color="secondary"
                                    onClick={()=>{this.handleEditRowHPS(index)}}
                                    size="sm"
                                  ><MdEdit/></Button>&nbsp;
                                  <Button 
                                    style={{background:'rgb(230 14 20)', borderColor:'rgb(230 14 20)'}}
                                    onClick={()=>{this.handelDeleteRowHPS(index)}}
                                    size="sm"
                                  ><MdDelete/></Button>                                
                                </td>
                              </tr>
                            ))}
                              <tr>
                                <th colSpan="5">Sub Total</th>
                                <td align="right">{commafy(this.state.subtotal)}</td>
                              </tr>
                              <tr hidden={!this.state.isManagementFee}>
                                <th colSpan="5">{"Management Fee"}</th>
                                <td align="right">{commafy(this.state.managementFee)}</td>
                              </tr>
                              <tr>
                                <th colSpan="5">{"PPN 10%"}</th>
                                <td align="right">{commafy(this.state.ppn)}</td>
                              </tr>
                              <tr>
                                <th colSpan="5">{"Grand Total"}</th>
                                <td align="right">{commafy(this.state.hrgtotal)}</td>
                              </tr>
                          </tbody>
                        </Table>
                      </Card>
                    </Col>
                    

                    <hr/>
                    <Col xl={12} lg={12} md={12}>
                      <FormGroup row>
                        <Col sm={{ offset: 7 }}>
                          <Button color="danger" onClick={()=>this.handleNext(2)}>Back</Button> &nbsp;
                          {this.renderBtnSaveDraft()} &nbsp;
                          <Button color="primary" onClick={()=> this.handleNext(4)}>Next</Button>
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
                          <Button color="danger" onClick={()=>this.handleNext(3)}>Back</Button> &nbsp;
                          {this.renderBtnSaveDraft()} &nbsp;
                          <Button color="secondary" onClick={()=> this.handleSubmit("generate")}>Generate DOCX</Button>
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
            Save
        </Button>
    );
  }
  handleEditRowHPS(idx){
    var dr = tableHPS[idx];
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
  }
  handleAddHPS(){
    console.log(dataKontrak);
    
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
    // if(dataKontrak.total == ''){
    //   cFalse++;
    //   this.setState({msg_tb5:'Harus diisi!'});
    // }

    console.log('cFalse: '+cFalse);
    if(cFalse>0){
      return;
    }

    var descr = dataKontrak.descr;
    var qty = dataKontrak.qty;
    var freq = dataKontrak.freq;
    var unitprice = dataKontrak.unitprice;
    var total = dataKontrak.total;
    var rowHPS = {
      descr: descr,
      qty: qty,
      freq: freq,
      unitprice: commafy(unitprice),
      total: commafy(total),
    }

    if(this.state.isEditHPS){
      tableHPS[this.state.indexEditHPS] = rowHPS;
      this.setState({isEditHPS:false})
    }else{
      tableHPS.push(rowHPS);
    }
    
    this.setState({TABEL: tableHPS})
    dataKontrak.TABEL = tableHPS;
    this.hitungTotal();
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

    
  }
  handelDeleteRowHPS(index){
    tableHPS.splice(index,1);
    this.setState({TABEL:tableHPS})
    dataKontrak.TABEL = tableHPS;
    this.hitungTotal();
  }
  cekNominalKontrak(){
    var grandtotal = this.state.hrgtotal;
    console.log('grandtotal:'+ grandtotal);
    if(grandtotal > 200000000){
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
          message: 'Sistem otomatis menghapus data penawaran terakhir',
          level: 'error',
        });
      }, 1000); 
      
      
      var idx = this.state.TABEL.length;
      this.handelDeleteRowHPS(idx-1);
    }
  }
  hitungTotal(){
    var subtot = 0;
    console.log(tableHPS);
    tableHPS.map((d)=>{
      subtot += parseInt(removeComma(d.total));
    })

    var ppn = subtot * (0.1);
    var mgmtFee = subtot * (dataKontrak.managementFeePctg/100);
    var isMgt = this.state.isManagementFee;
    var hrgtotal = subtot + ppn + (isMgt?mgmtFee:0);

    this.setState({
      subtotal: subtot,
      ppn: ppn,
      managementFee: mgmtFee,
      hrgtotal: hrgtotal
    })

    dataKontrak.subtotal = subtot;
    dataKontrak.ppn = ppn;
    dataKontrak.hrgtotal = hrgtotal;
    dataKontrak.managementFee = mgmtFee;
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

export default Form200Up;