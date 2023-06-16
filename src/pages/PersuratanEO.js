import Page from 'components/Page';
import React from 'react';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import { QRCode } from 'react-qrcode-logo';
import { Card, CardBody, CardHeader, Col, Row, Table, Button, Badge, FormGroup, FormText,
  Input, InputGroup, InputGroupAddon, InputGroupButton } from 'reactstrap';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import { saveAs } from 'file-saver';
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
import Pdf from "react-to-pdf";
import Pagination from "react-js-pagination";
import Label from 'reactstrap/lib/Label';
import qr_logo from '../assets/img/logo/qr_logo.png';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import ImageModule from 'docxtemplater-image-module-free';
import kop_surat from '../assets/img/logo/kop_surat.jpg';

const download = require('downloadjs');

const tableTypes = ['', 'bordered', 'striped', 'hover'];

var dataPeg = [];
var dataPerjadin = [];
const ref = React.createRef();

var base64Pdt, segmen;

const form_surat = [
    { label: 'Segmen', type: 'select', id: 'tipe_surat', col:5, placeholder:'', mandatory: true, options:[
      { value: 2, label: 'Kelompok Masyarakat'},
      { value: 1, label: 'Pendidikan'},
    ] },
    { label: 'Penandatangan', type: 'select', id: 'pdt', col:5, placeholder:'', mandatory: true, options:[
      { value: 1, label: 'Direktur Pemberdayaan Informatika'},
      { value: 2, label: 'Direktur Jenderal Aplikasi Informatika'}
    ] },
    { label: 'Tanggal Surat', type: 'date', id: 'tgl_surat', col:5, placeholder:'', mandatory: true },
    { label: 'Nomor Surat', type: 'text', id: 'no_surat', col:5, placeholder:'cth: 834.P', mandatory: true },
    { label: 'Kepada Yth', type: 'textarea', id: 'kepada', col:9, placeholder:'cth: Kepala Dinas Komunikasi dan Informatika \n\tDaerah Istimewa Yogyakarta', mandatory: true },
    { label: 'Nama Perusahaan EO', type: 'text', id: 'nama_perusahaan', col:9, placeholder:'cth: PT. Debindomulti Adhiswasti', mandatory: true },
    { label: 'Wilayah EO', type: 'text', id: 'wilayah', col:9, placeholder:'cth: DI Yogyakarta', mandatory: true },
    { label: 'Kontak EO', type: 'text', id: 'pic', col:9, placeholder:'cth: Saudari Srianti (0811-4101-500)', mandatory: true },
    { label: 'Tembusan', type: 'textarea', id: 'tembusan', col:9, placeholder:'cth: 1. Gubernur \n\t2. Walikota', mandatory: false },
];
function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
}
class PersuratanEO extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      userid:localStorage.getItem("user_session"),
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
      body: JSON.stringify({ userid: localStorage.getItem("user_session"), search: this.state.search })
    };
    fetch(process.env.REACT_APP_URL_API+'/rest/viewPersuratan.php', requestOptions)
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
  
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const key = target.name;
    if(target.type=="file"){
      this.setState({[key]:''});
      this.getFile(event.target.files[0],key);
    }
    //console.log(value);
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

  async simpanSurat(){
    
    
    try{
        for(var x = 0; x <= form_surat.length; x++){
            if(this.state[x.id]==undefined){
                this.sendErrorNotif("Lengkapin dulu form nya beg*");
                break; 
            }
        }
        //var pathTemplate = window.location.origin + '/dod_character.pdf';
        const pathTemplate = window.location.origin + '/template_persuratan.pdf';
        //console.log(pathTemplate);
        const formPdfBytes = await fetch(pathTemplate).then(res => res.arrayBuffer())
        //return;
        // Load a PDF with form fields
        const pdfDoc = await PDFDocument.load(formPdfBytes)
        console.log(pdfDoc);
        // Get the form containing all the fields
        const form = pdfDoc.getForm();
    
        var tgl_arr = this.state.tgl_surat.split("-");
        var str_tgl = tgl_arr[2]+" "+getBln(tgl_arr[1])+" "+tgl_arr[0];
        // Fill the form's fields

        var no_srt = this.state.no_surat+"/DJAI.5/AI.03.01/"+tgl_arr[1]+"/"+tgl_arr[0];
        form.getTextField('tgl_surat').setText(str_tgl);
        form.getTextField('no_surat').setText(no_srt);
        form.getTextField('kepada').setText(this.state.kepada);
        var desc_field = form.getTextField('desc_detail');
        var text_desc = desc_field.getText();
        text_desc.replace("{nama_perusahaan}", this.state.nama_perusahaan);
        desc_field.setText(text_desc);
        //.setText("Berkenaan hal tersebut dapat kami sampaikan bahwa Kementerian Komunikasi dan Informatika melalui Direktorat Pemberdayaan Informatika, Ditjen Aptika telah menetapkan PT. Debindomulti Adhiswasti sebagai Penyelenggara kegiatan Webinar “Indonesia Makin Cakap Digital” di Wilayah DI Yogyakarta. Sesuai dengan jadwal yang telah disusun, maka implementasi kegiatan literasi digital akan dilaksanakan dari bulan Juni sampai dengan Desember 2022. Untuk itu kami mohon kesediaan Bapak/Ibu untuk dapat menerima dan berkoordinasi dengan Tim PT. Debindomulti Adhiswasti serta berkenan merekomendasikan organisasi/kelompok masyarakat di wilayah kerja Bapak/Ibu untuk dapat menjadi peserta dalam kegiatan Literasi Digital di wilayah yang Bapak/Ibu pimpin. Untuk komunikasi dan kontak lebih lanjut bisa melalui Saudari Srianti (0811-4101-500).");

        const canvas = document.getElementById("qrCode");
        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const qrBytes = await fetch(pngUrl).then(res => res.arrayBuffer())
        const qrImage = await pdfDoc.embedPng(qrBytes)

        const qrCodeForm = form.getButton('qr_code')
        qrCodeForm.setImage(qrImage)
        // Flatten the form's fields
        form.flatten();
    
        // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save();
    
        // Trigger the browser to download the PDF document
        download(pdfBytes, "your file.pdf", "application/pdf");
    }catch(err){
        alert("Generate gagal, code : " + err);
    }finally{
        //this.setState({downloading:false})
    }
    var body = {
        
    }
    // if(this.state.isEdit){
    //     body.id = this.state.editedID;
    //     body.unique_id = this.state.editedUID;
    // }
    // const requestOptions = {
    //     method: 'POST',
    //     //headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(body)
    //   };
    //   fetch(process.env.REACT_APP_URL_API+'/rest/insertPerjadin.php', requestOptions)
    //   .then(response => response.json())
    //   .then(respon => {
    //       if(respon.response_code==200){
    //         this.setState({inputBaru:false});
    //         this.notificationSystem.addNotification({
    //             title: <MdCloudDone />,
    //             message: "Data berhasil disimpan",
    //             level: 'success',
    //           });
    //         this.loadData();
    //         var dtHead = {
    //             nama_kegiatan: nmKeg, tgl_kegiatan: tglKeg, asal:asal, tujuan: tujuan
    //         }
    //         var dtBody = dataPerjadin;
    //         var dt = {head: dtHead, body: dtBody};
    //         generateKwtPerjadin(dt, "/Template_Perjadin.docx");
    //       }else{
    //         this.sendErrorNotif(respon.message)
    //       }
    //   });
  }

  async presave(){
    this.setState({modal:true})
    var salah=0;
    var bodyParam = {};
    for(var x = 0; x < form_surat.length; x++){
        var id = form_surat[x].id;
        var val = document.getElementById(id).value
        if((val==null||val==''||val==undefined)&&form_surat[x].mandatory){
            this.sendErrorNotif("Lengkapin dulu form nya beg*");
            salah++;
            break; 
        }else{
            bodyParam[id]=document.getElementById(id).value;
        }
    }
    if(salah>0){
        this.setState({modal:false})
        return;
    }
    bodyParam.userid = localStorage.getItem("user_session");
    //console.log(bodyParam)
    //return;
    if(this.state.isEdit){
        bodyParam.id = this.state.editedID;
    }
    const req = {
      method: 'POST',
      body: JSON.stringify({
        userid: localStorage.getItem("user_session"), 
        id_pdt: document.getElementById("pdt").value, 
        id_tipe_surat: document.getElementById("tipe_surat").value
      })
    }
    //console.log(req)
    //return;
    await fetch(process.env.REACT_APP_URL_API+'/rest/getBase64PdtSurat.php', req)
    .then(response => response.json())
    .then(respon => {
      var dataAPI = respon;
      //this.setState({modal:false});
      if(dataAPI.response_code != 200){
          this.sendErrorNotif(dataAPI.message);
          this.setState({modal:false})
      }else{
        base64Pdt = dataAPI.data.base64Image;
        segmen = dataAPI.data.segmen;
      }
    })
    //console.log(bodyParam)
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(bodyParam)
      };
      fetch(process.env.REACT_APP_URL_API+'/rest/insertPersuratan.php', requestOptions)
          .then(response => response.json())
          .then(respon => {
            var dataAPI = respon;
            //this.setState({modal:false});
            if(dataAPI.response_code != 200){
                this.sendErrorNotif(dataAPI.message);
                this.setState({modal:false})
            }else{
                this.simpan();
            }
          });



  }
  async simpan(){
    
    var path = window.location.origin + '/template_persuratan.docx';
    const canvas = document.getElementById("qrCode");
    const pngUrl = canvas.toDataURL("image/png");//.replace("image/png", "image/octet-stream");
   

    await loadFile(path, function(
        error,
        content
      ) {
        if (error) {
          throw error;
        }
        //var ImageModule = require("open-docxtemplater-image-module");
        var opts = {};
        opts.centered = true;
        opts.getImage = function (tagValue, tagName) {
          const base64Regex = /^data:image\/(png|jpg|svg|svg\+xml);base64,/;
          if (!base64Regex.test(tagValue)) {
            return false;
          }
          const stringBase64 = tagValue.replace(base64Regex, "");
          let binaryString;
          if (typeof window !== "undefined") {
            binaryString = window.atob(stringBase64);
          } else {
            binaryString = Buffer.from(stringBase64, "base64").toString(
              "binary"
            );
          }
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            const ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
          }
          return bytes.buffer;
        };
        opts.getSize = function (img, tagValue, tagName) {
            var width = 100;
            var height = 100;
            const forceWidth = 100;
            const ratio = forceWidth / width;
            // return [
            //   forceWidth,
            //   // calculate height taking into account aspect ratio
            //   Math.round(height * ratio),
            // ];
            //return [70,70];
            if(tagName=="pdtImage"){
              return [200,50]
            }else{
              return [70,70]
            }
          };
        
  
        var imageModule = new ImageModule(opts);
  
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
          nullGetter: nullGetter,
          modules: [imageModule],
        }).compile();
        
        var isEs1 = document.getElementById("pdt").value == 2;
        var tgl_arr = document.getElementById("tgl_surat").value.split("-");
        var str_tgl = tgl_arr[2]+" "+getBln(tgl_arr[1])+" "+tgl_arr[0];
        var no = isEs1 ? '/KOMINFO/DJAI/HM.01.01/' : '/DJAI.5/AI.03.01/';
        var no_srt = document.getElementById("no_surat").value + no + tgl_arr[1] + "/" + tgl_arr[0];
        var nm_perusahaan = document.getElementById("nama_perusahaan").value;
        
        var isTembus = document.getElementById("tembusan").value;
        doc.setData({
            tgl_surat: str_tgl,
            no_surat: no_srt,
            kepada: document.getElementById("kepada").value,
            nama_perusahaan: nm_perusahaan,
            pic: document.getElementById("pic").value,
            wilayah: document.getElementById("wilayah").value,
            myImage: pngUrl,
            kop: isEs1? '':'DIREKTORAT PEMBERDAYAAN INFORMATIKA',
            pdt: isEs1? 'Direktur Jenderal Aplikasi Informatika' : 'Direktur Pemberdayaan Informatika',
            pdtImage: base64Pdt,
            segmen: segmen,
            tembusan: "Tembusan\n"+document.getElementById("tembusan").value

        });
        //console.log(hps2);
        try {
          // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
          doc.render();
          //console.log(dataKontrak);
        } catch (error) {
          // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
          function replaceErrors(key, value) {
            if (value instanceof Error) {
              return Object.getOwnPropertyNames(value).reduce(function(
                error,
                key
              ) {
                error[key] = value[key];
                return error;
              },
              {});
            }
            return value;
          }
          //console.log(JSON.stringify({ error: error }, replaceErrors));
  
          if (error.properties && error.properties.errors instanceof Array) {
            const errorMessages = error.properties.errors
              .map(function(error) {
                return error.properties.explanation;
              })
              .join('\n');
            console.log('errorMessages', errorMessages);
            // errorMessages is a humanly readable message looking like this :
            // 'The tag beginning with "foobar" is unopened'
          }
          throw error;
        }
        const out = doc.getZip().generate({
            type: 'blob',
            mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              //'application/pdf'
              //'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          });
        var reader = new FileReader();
        const pvw = doc.getZip().generate({
            type: "nodebuffer",
            compression: "DEFLATE",
            //mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
        var blob = new Blob([pvw], {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          });

          var nomor = document.getElementById("no_surat").value;
          reader.readAsDataURL(blob);
          reader.onloadend = function() {
            var base64data = reader.result;
            fetch(process.env.REACT_APP_URL_API+'/rest/uploadFileSurat.php', {
              method: 'POST',
              body: JSON.stringify({ base64: base64data, no_surat: nomor})
            }).then((response) => {
              console.log(response)
              //var src = "https://view.officeapps.live.com/op/embed.aspx?src="+"https://sikarliaapi.000webhostapp.com/rest/asu.docx";//+"&embedded=true";
              //var src = "https://docs.google.com/viewerng/viewer?url="+"https://sikarliaapi.000webhostapp.com/rest/asu.docx"+"&embedded=true";
              var src = 'https://docs.google.com/viewer?url='+process.env.REACT_APP_URL_API+'/rest/surat/'+nomor+'.docx&embedded=true';
              
            })
          };
        var nama_file = no_srt.replaceAll("/","_");
        saveAs(out, nama_file+'.docx');        
        form_surat.map(x=>{
            document.getElementById(x.id).value = null;
        })
      });
      this.setState({editedID:undefined,isEdit:false, modal:false})
      this.loadData();
  }
  
  downloadKwt(idx){
      var dtHead = this.state.data[idx];
      var dtBody = [];

      var link = "https://sikarlia.com/viewsurat?no="+(dtHead.no_surat);
      window.open(link);
      
  }
  gotoEdit(idx){
    window.scrollTo(0, 0);
    this.setState({isEdit: true, inputBaru: true})
    var dtHead = this.state.data[idx];
    form_surat.map(x=>{
        document.getElementById(x.id).value = dtHead[x.id];
        this.setState({[x.id]: dtHead[x.id]})
    })
    
    this.setState({editedID: dtHead.id, editedUID: dtHead.unique_id});
    
  }
  deleteData(idx){
    var result = window.confirm("Apakah anda yakin ingin menghapus data?");
    if (result) {
      const requestOptions = {
        method: 'POST',
        //headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: this.state.data[idx].id })
      };
      fetch(process.env.REACT_APP_URL_API+'/rest/deletePersuratan.php', requestOptions)
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
        title="Persuratan EO"
        breadcrumbs={[{ name: 'Persuratan EO', active: true }]}
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
                <Row style={{fontSize:11}}>
                    <Col xl={12} lg={12} md={12}>
                        {form_surat.map(x => (
                            <FormGroup row>
                                <Label sm={3}>
                                    {x.label}
                                </Label>
                                <Col sm={x.col}>
                                <Input
                                    style={{fontSize:11}}
                                    //style={{height:'160px'}}
                                    type={x.type}
                                    name={x.id}
                                    id={x.id}
                                    placeholder={x.placeholder}
                                    onChange={this.handleInputChange}
                                >
                                  {x.type=="select"?
                                    x.options.map(y=>(
                                      <option value={y.value}>{y.label}</option>
                                    ))
                                  :null}
                                </Input>
                                </Col>
                            </FormGroup>
                        ))}
                        <FormGroup row>
                            <Label sm={3}>
                                {"Generated QRCode"}
                            </Label>
                            <Col sm={9}>
                                <QRCode 
                                    size={300}
                                    logoWidth={100}
                                    ecLevel={"H"}
                                    //qrStyle={'dots'}
                                    id={'qrCode'}
                                    logoImage={qr_logo}
                                    removeQrCodeBehindLogo={true}
                                    //quietZone={30}
                                    eyeRadius={[
                                        [10, 10, 0, 10], // top/left eye
                                        [10, 10, 10, 0], // top/right eye
                                        [10, 0, 10, 10], // bottom/left
                                    ]}
                                    value={"https://sikarlia.com/viewsurat?no="+(this.state.no_surat||'')} />
                                {/* <div style={{display:'none'}}>
                                <QRCode 
                                    size={300}
                                    //logoWidth={50}
                                    ecLevel={"H"}
                                    //qrStyle={'dots'}
                                    id={'qrCode'}
                                    logoImage={qr_logo}
                                    removeQrCodeBehindLogo={true}
                                    //quietZone={30}
                                    eyeRadius={[
                                        [30, 30, 0, 30], // top/left eye
                                        [30, 30, 30, 0], // top/right eye
                                        [30, 0, 30, 30], // bottom/left
                                    ]}
                                    value={"https://sikarlia.com/viewsurat?no="+(this.state.no_surat||'')} />
                                </div> */}
                            </Col>
                        </FormGroup>
                        
                        <hr/>
                        <Col className="d-flex justify-content-between">&nbsp;
                            <Button sm color="success" onClick={()=>{this.presave()}}><MdSave/>&nbsp;&nbsp;Simpan</Button>
                        </Col>
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
                <Button
                    title="Buat Surat Baru"
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
                      <th>Nomor Surat</th>
                      <th>Segmen</th>
                      <th>Penandatangan</th>
                      <th>Nama Perusahaan EO</th>
                      <th>Tanggal Surat</th>
                      <th style={{width:"140px"}}>Action</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.dataRender.map((dt,index)=>(
                      <tr style={{backgroundColor:(index%2==0)?"#eff4fc":"#fff", height:60}} key={index}>
                        <td scope="row">{((activePage*itemPerPage)-itemPerPage) + index+1}</td>
                        <td>{dt.no_surat}</td>
                        <td>{dt.segmen}</td>
                        <td>{dt.pdt==1?"Direktur PI":"Dirjen"}</td>
                        <td>{dt.nama_perusahaan}</td>
                        <td>{dt.tgl_surat}</td>
                        <td>
                          <Button 
                            title="Unduh Surat"
                            color="success"
                            onClick={()=>{
                              this.downloadKwt(((activePage*itemPerPage)-itemPerPage) + index)
                              //this.setState({isPvw:true})
                            }}
                            size="sm"
                          ><MdFileDownload/></Button>&nbsp;                               
                          <Button 
                            hidden={usertype==2?false:true}
                            title="Ubah Surat"
                            color="secondary"
                            onClick={()=>{this.gotoEdit(((activePage*itemPerPage)-itemPerPage) + index)}}
                            size="sm"
                          ><MdEdit/></Button>&nbsp;                               
                          <Button 
                            title="Hapus Surat"
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

function getBln(txtNo){
    var rtn;
    switch(txtNo){
        case '01': rtn = "Januari"; break;
        case '02': rtn = "Februari"; break;
        case '03': rtn = "Maret"; break;
        case '04': rtn = "April"; break;
        case '05': rtn = "Mei"; break;
        case '06': rtn = "Juni"; break;
        case '07': rtn = "Juli"; break;
        case '08': rtn = "Agustus"; break;
        case '09': rtn = "September"; break;
        case '10': rtn = "Oktober"; break;
        case '11': rtn = "November"; break;
        case '12': rtn = "Desember"; break;
    }
    return rtn;
}
function nullGetter(part, scopeManager) {
    /*
        If the template is {#users}{name}{/} and a value is undefined on the
        name property:
  
        - part.value will be the string "name"
        - scopeManager.scopePath will be ["users"] (for nested loops, you would have multiple values in this array, for example one could have ["companies", "users"])
        - scopeManager.scopePathItem will be equal to the array [2] if
          this happens for the third user in the array.
        - part.module would be empty in this case, but it could be "loop",
          "rawxml", or or any other module name that you use.
    */
  
    if (!part.module) {
        // part.value contains the content of the tag, eg "name" in our example
        // By returning '{' and part.value and '}', it will actually do no replacement in reality. You could also return the empty string if you prefered.
        return '{' + part.value + '}';
        //return '';
    }
    if (part.module === "rawxml") {
        return "";
    }
    return "";
  }

export default PersuratanEO;
