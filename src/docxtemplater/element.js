import {
    Button,Card,CardBody,CardHeader,Col,
    Form,FormFeedback,FormGroup, InputGroup, InputGroupAddon,
    FormText,Input,Label,Row,Table,Modal,ModalBody
  } from 'reactstrap';
import React from 'react';
import loadingImg from 'assets/img/logo/loading.gif';

export const reSatPlkPkjChooser = (selectedIdx) => {
    var options = [];
    var data = ["hari","minggu","bulan"];
    for(var i = 0; i < 3; i++){
      options.push(<option selected={(i==selectedIdx?true:false)} key={i} value={data[i]}>{data[i]}</option>)
    }
    return (
      <Input 
        type="select" name="chooserSatPlkPkj" 
        id="chooserSatPlkPkj" 
      >
        {options}
      </Input>
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
      <img src={loadingImg}></img>
    </ModalBody>
  </Modal>
}

export const getDefaultSetDataKontrak = (tipe) => {
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
      
        tipeKontrak:tipe,
        namaPerusahaanPembanding1:'', 	
        alamatPerusahaanPembanding1:'',
        namaPerusahaanPembanding2:'', 	
        alamatPerusahaanPembanding2:'',
        namaDirekturPembanding1:'',
        namaDirekturPembanding2:'',
        satPlkPkj:'hari',
        indexSatPlkPkj:0,
      };
}

export const getStatusKontrak = (tipe, data) =>{
  if (tipe == '200up'){
    if(data.nipPokja1==null || data.nipPokja1 == '' || data.hrgtotal==null || data.hrgtotal == 0){
      return 'Draft';
    }else{
      return 'Completed';
    }
  }

  if (tipe == '50200PL' || tipe == '50200NonPL'){
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
        
  return data;
}