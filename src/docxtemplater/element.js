import {
    Button,Card,CardBody,CardHeader,Col,
    Form,FormFeedback,FormGroup, InputGroup, InputGroupAddon,
    FormText,Input,Label,Row,Table,Modal,ModalBody, ModalFooter
  } from 'reactstrap';
import React from 'react';
import loadingImg from 'assets/img/logo/loading.gif';
import { func } from 'prop-types';

export const reSatPlkPkjChooser = (selectedIdx) => {
    var options = [];
    var data = ["hari","minggu","bulan"];
    for(var i = 0; i < 3; i++){
      options.push(<option selected={(i==selectedIdx?true:false)} key={i} value={data[i]}>{data[i]}</option>)
    }
    return (
      <div>
        <Row><Label style={{marginTop:5}}>Hari</Label></Row>
      <Input 
        type="select" name="chooserSatPlkPkj" 
        id="chooserSatPlkPkj" 
        disabled
        hidden
      >
        {options}
      </Input>
      </div>
    )
  }
export const reMgmtFeeChooser = (selectedIdx) => {
  var options = [];
  var data = ["Nominal","Percentage"];
  for(var i = 0; i < data.length; i++){
    options.push(<option selected={(i==selectedIdx?true:false)} key={i} value={data[i]}>{data[i]}</option>)
  }
  return (
    <div>
    <Input 
      type="select" name="chooserMgmtFee" 
      id="chooserMgmtFee" 
    >
      {options}
    </Input>
    </div>
  )
}
export const modalLoading = (state) =>{
  return <Modal
    style={{
      position: 'absolute',
      float: 'left',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    }}
    isOpen={state}
    >

    <ModalBody>
      <img src={loadingImg} style={{
        //width:'40%', 
        //height:'40%'
      }}></img>
    </ModalBody>
  </Modal>
}

export const modalInfo = (state) =>{
  return <Modal
    id={'modalInfo'}
    style={{
      position: 'absolute',
      float: 'left',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    }}
    isOpen={state}
    toggle={state}
    >

    <ModalBody>
      <img 
      style={{width:'100%'}}
      src={'https://sikarlia.com/api/rest/pengumuman/Update%20SIKARLIA%201_2.gif'}></img>
    </ModalBody>
    <ModalFooter>
      <Button color="secondary" onClick={()=>{
        var prt = document.getElementById("modalInfo").parentElement;
        console.log(this)
        //prt.style = {display:'none'}
      }}>
        Close
      </Button>
    </ModalFooter>
  </Modal>
}

export const getDefaultSetDataKontrak = (tipe) => {
  var jenisPengadaan = '';
  if(tipe=='200up'||tipe=='100up'){
    jenisPengadaan = (tipe=='100up') ? "Jasa Konsultasi" : '';
  }
    return {
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
        managementFeeHPS:0,
      
        subtotal:0,
        ppn:0,
        hrgtotal:0,

        subtotalHPS:0,
        ppnHPS:0,
        hrgtotalHPS:0,
      
        TABEL:[],
        TABELPnw:[],
        managementFeePctg:0,
        managementFeePctgPnw:0,
        cb_managementFee:false,
        cb_managementFeePnw:false,
        isPPN:true,
        isPPNPnw:true,
        
        suratKesanggupan:'0000-00-00',	
        namaGroupPokja:null,
        pokja1:null,				
        pokja2:null,				
        pokja3:null,				
        pokja4:null,				
        pokja5:null,				
        nipPokja1:null,			
        jabatan:"Direktur Utama",			
      
        tipeKontrak:tipe,
        namaPerusahaanPembanding1:'', 	
        alamatPerusahaanPembanding1:'',
        namaPerusahaanPembanding2:'', 	
        alamatPerusahaanPembanding2:'',
        namaDirekturPembanding1:'',
        namaDirekturPembanding2:'',
        jabatanPmb1:'',
        jabatanPmb2:'',
        satPlkPkj:'hari',
        indexSatPlkPkj:0,

        jenisPengadaan:jenisPengadaan,
        isHPSimg:null,
        isPnwimg:null,
        base64HPS:'',

        isPctgMgmtFee:1,
        isPctgMgmtFeePnw:1,
        mgmtFeeNmnl:0,
        mgmtFeeNmnlPnw:0,
      };
}

export const getStatusKontrak = (tipe, data) =>{
  if (tipe == '200up' || tipe=='100up'){
    if(data.nipPokja1==null || data.nipPokja1 == '' || data.hrgtotal==null || data.hrgtotal == 0){
      return 'Draft';
    }else{
      return 'Completed';
    }
  }

  else{
    if(data.hrgtotal==null || data.hrgtotal == 0){
      return 'Draft';
    }else{
      return 'Completed';
    }
  }
}

export const setupTgl = (data) =>{
  data.suratPermintaanPPK = data.suratPermintaanPPK == '0000-00-00'? '1900-01-01':data.suratPermintaanPPK;
  data.pengadaanBarJas = data.pengadaanBarJas == '0000-00-00'? '1900-01-01':data.pengadaanBarJas;
  data.HPS = data.HPS == '0000-00-00'? '1900-01-01':data.HPS;
  data.pengajuanPenawaran = data.pengajuanPenawaran == '0000-00-00'? '1900-01-01':data.pengajuanPenawaran;
  data.penawaranRKS = data.penawaranRKS == '0000-00-00'? '1900-01-01':data.penawaranRKS;
  data.undanganEvaluasi = data.undanganEvaluasi == '0000-00-00'? '1900-01-01':data.undanganEvaluasi;
  data.evaluasi = data.evaluasi == '0000-00-00'? '1900-01-01':data.evaluasi;
  data.penetapanPenyedia = data.penetapanPenyedia == '0000-00-00'? '1900-01-01':data.penetapanPenyedia;
  data.laporanPelaksanaan = data.laporanPelaksanaan == '0000-00-00'? '1900-01-01':data.laporanPelaksanaan;
  data.suratPemesanan = data.suratPemesanan == '0000-00-00'? '1900-01-01':data.suratPemesanan;
  data.penandatangananKontrak = data.penandatangananKontrak == '0000-00-00'? '1900-01-01':data.penandatangananKontrak;
  data.suratKesanggupan = data.suratKesanggupan == '0000-00-00'? '1900-01-01':data.suratKesanggupan;
  data.penyelesaianPekerjaan = data.penyelesaianPekerjaan == '0000-00-00'? '1900-01-01':data.penyelesaianPekerjaan;
  data.pembayaran = data.pembayaran == '0000-00-00'? '1900-01-01':data.pembayaran;
  data.TABELPnw = data.TABELPnw == undefined ? [] : data.TABELPnw;
  
  data.subtotalHPS = data.subtotalHPS == undefined ? [] : data.subtotalHPS;
  data.ppnHPS = data.ppnHPS == undefined ? [] : data.ppnHPS;
  data.hrgtotalHPS = data.hrgtotalHPS == undefined ? [] : data.hrgtotalHPS;

  return data;
}

export const getDashboardElmt = (tipe, elmt="") =>{
  var data = [
    {tipe : '200up', title: 'Diatas 200 Juta', subtitle: 'Kontrak Barang & Jasa Lainnya', jml: 0},
    {tipe : '50200PL', title: '50-200 Juta', subtitle: 'Kontrak Barang & Jasa Lainnya', jml: 0},
    {tipe : '50200NonPL', title: '50-200 Juta PL', subtitle: 'Kontrak Barang & Jasa Lainnya', jml: 0},
    {tipe : '100up', title: 'Diatas 100 Juta', subtitle: 'Kontrak Jasa Konsultasi', jml: 0},
    {tipe : '100PL', title: 'Dibawah 100 Juta PL', subtitle: 'Kontrak Jasa Konsultasi', jml: 0},
    {tipe : '100NonPL', title: 'Dibawah 100 Juta', subtitle: 'Kontrak Jasa Konsultasi', jml: 0},
  ]

  var rtn = data.filter(function(x) {return x.tipe == tipe});
  console.log(rtn);
  return rtn;
}

export const autoBAPP = (flag="penandatangananKontrak",dataKontrak) => {
  //const isSPK = 'penandatangananKontrak';
  var durasiPLK = document.getElementById("pelaksanaanPekerjaan").value;
  var SPK = document.getElementById("penandatangananKontrak").value;
  var BAPP = document.getElementById("penyelesaianPekerjaan").value;
  console.log("autoBAPP: "+durasiPLK,SPK);
  console.log(dataKontrak)
  if((SPK!='' || BAPP!='') && durasiPLK!=''){
    var isSPK;
    if(SPK!='' && BAPP==''){ isSPK = true; console.log(true)} 
    else if(BAPP!='' && SPK==''){ isSPK = false; console.log(false)}
    else if(BAPP!='' && SPK!=''){ 
      isSPK = flag=='penandatangananKontrak'?true:(flag=='pelaksanaanPekerjaan')?true:false;
      console.log('isSPK: '+isSPK)
    }

    var arrD = isSPK?SPK.split('-') : BAPP.split('-');
    var d = new Date();
    d.setFullYear(arrD[0],arrD[1]-1,arrD[2]);
    var formated;
    var dtSPK = new Date();
    if(isSPK){
      dtSPK.setFullYear(arrD[0],arrD[1]-1,arrD[2]);
      d.setDate(d.getDate() + Number.parseInt(durasiPLK)-1);
      
      var isFriday = (d.getDay() == 5) ? true : false;
      var isSaturday = (d.getDay() == 6) ? true : false;
      var isSunday = (d.getDay() == 0) ? true : false;
        
        // if(isSaturday){
        //   d.setDate(d.getDate() + 2);
        // }
        // else if(isSunday){
        //   d.setDate(d.getDate() + 1);
        // }
        // else{
        //   //d.setDate(d.getDate() + Number.parseInt(durasiPLK)-1);
        // }
        if(isFriday){
          dataKontrak.message = "BAP jatuh di hari Sabtu/Minggu. Apakah anda yakin ingin melanjutkan?";
        }
        else if(isSaturday || isSunday){
          dataKontrak.message = "BAPP jatuh di hari Sabtu/Minggu. Apakah anda yakin ingin melanjutkan?";
        }else{
          dataKontrak.message = "";
        }
      formated = getFormattedDate(d);
      console.log('BAPP: '+ formated);
      dataKontrak.penyelesaianPekerjaan = formated;
      document.getElementById("penyelesaianPekerjaan").value = formated;
    }else{
      d.setDate(d.getDate() - Number.parseInt(durasiPLK)+1);
      var isSaturday = (d.getDay() == 6) ? true : false;
      var isSunday = (d.getDay() == 0) ? true : false;
      if(isSaturday || isSunday){
        dataKontrak.message = "SPK jatuh di hari Sabtu/Minggu. Apakah anda yakin ingin melanjutkan?";
      }else{
        dataKontrak.message = "";
      }
      formated = getFormattedDate(d);
      console.log('SPK: '+ formated);
      dataKontrak.penandatangananKontrak = formated;
      document.getElementById("penandatangananKontrak").value = formated;
    } 

    var arrElmt = [
      {diff:1, elmt:'suratPemesanan'},
      {diff:1, elmt:'laporanPelaksanaan'},
      {diff:1, elmt:'suratKesanggupan'},
      {diff:1, elmt:'penetapanPenyedia'},
      {diff:1, elmt:'evaluasi'},
      {diff:1, elmt:'undanganEvaluasi'},
      {diff:1, elmt:'pengajuanPenawaran'},
      {diff:1, elmt:'penawaranRKS'},
      {diff:1, elmt:'HPS'},
      {diff:0, elmt:'pengadaanBarJas'},
      {diff:1, elmt:'suratPermintaanPPK'},
    ]
    
    for(var x=0; x<arrElmt.length; x++){
      //var isExist = document.getElementById(arrElmt[x].elmt)==undefined?false:true;
      var isExist = !(document.getElementById(arrElmt[x].elmt).hidden)
      if(isExist){
        dtSPK.setDate(dtSPK.getDate() - arrElmt[x].diff);
        var isSaturday = (dtSPK.getDay() == 6) ? true : false;
        var isSunday = (dtSPK.getDay() == 0) ? true : false;
        
        if(isSaturday){
          dtSPK.setDate(dtSPK.getDate() - 1);
        }else if(isSunday){
          dtSPK.setDate(dtSPK.getDate() - 2);
        }
        var fmt = getFormattedDate(dtSPK);
        document.getElementById(arrElmt[x].elmt).value = fmt;
        dataKontrak[arrElmt[x].elmt] = fmt;
      }
    }

    var pembayaran = getFormattedPembayaran();
    document.getElementById('pembayaran').value = pembayaran;
    dataKontrak.pembayaran = pembayaran;

    console.log(dataKontrak);
    return dataKontrak;
  }
  return dataKontrak;
}

function getFormattedPembayaran(){
  var BAPP = document.getElementById("penyelesaianPekerjaan").value;
  var arrD = BAPP.split('-');
  var d = new Date();
  d.setFullYear(arrD[0],arrD[1]-1,arrD[2]);
  d.setDate(d.getDate() + 1);
  var isSaturday = (d.getDay() == 6) ? true : false;
  var isSunday = (d.getDay() == 0) ? true : false;
    
    // if(isSaturday){
    //   d.setDate(d.getDate() + 2);
    // }
    // else if(isSunday){
    //   d.setDate(d.getDate() + 1);
    // }
    // else{
    //   //d.setDate(d.getDate() + Number.parseInt(durasiPLK)-1);
    // }
  return getFormattedDate(d);
}
function getFormattedDate(d){
  var mth = (d.getMonth()+1) < 10 ? "0"+(d.getMonth()+1) : (d.getMonth()+1); 
  var date = d.getDate() < 10 ? "0"+(d.getDate()) : (d.getDate()); 
  var Formated = [d.getFullYear(), mth, date].join("-");
  return Formated;
}