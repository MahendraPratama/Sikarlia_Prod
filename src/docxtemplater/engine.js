import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import React from 'react';
import { saveAs } from 'file-saver';
import { set } from 'react-ga';
import angkaTerbilang from '@develoka/angka-terbilang-js';

import DocViewer from "react-doc-viewer";

function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
}
export const generateDocument = (dataKontrak, namaFile, isPreview = false) => {
  var hps2 = [
    {judul: "Sub Total", nilai: commafy(dataKontrak.subtotal)},
    {judul: "PPN 10%", nilai: commafy(dataKontrak.ppn)},
    {judul: "Grand Total", nilai: commafy(dataKontrak.hrgtotal)},
  ];

  var path = window.location.origin  + namaFile;
  console.log("engine: " + path);
  if(dataKontrak.cb_managementFee){
    hps2.splice(1,0,{judul: "Management Fee", nilai: commafy(dataKontrak.managementFee)});
  }  


    //event.PreventDefault();
    loadFile(path, function(
      error,
      content
    ) {
      if (error) {
        throw error;
      }
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true
      });
      doc.setData(getDataSet(dataKontrak, hps2));
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
        console.log(JSON.stringify({ error: error }, replaceErrors));

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
          //'application/pdf'
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }); //Output the document using Data-URI
      if(isPreview){
        
        //var newurl = window.URL.createObjectURL(out);
        //console.log("blob link: "+ newurl.substring(4,newurl.length+1));
        //console.log(doc.getZip);
        //var trim = newurl.substring(4,newurl.length+1);
        
        // setTimeout(()=>{
        //   document.getElementById("viewer").src = src;
        // },200)
        
        //document.getElementById("viewer").src = src;
        // return <DocViewer documents={{ uri: newurl }} />;
        var reader = new FileReader();
        const pvw = doc.getZip().generate({
          type: "nodebuffer",
          compression: "DEFLATE",
          //mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        })
        var blob = new Blob([pvw], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
        //saveAs(blob)
        try{
          reader.readAsDataURL(blob);
          reader.onloadend = function() {
            var base64data = reader.result;
            fetch(process.env.REACT_APP_URL_API+'/rest/uploadFileViewer.php', {
              method: 'POST',
              body: JSON.stringify({ base64: base64data, userid: dataKontrak.userid})
            }).then((response) => {
              console.log(response)
              //var src = "https://view.officeapps.live.com/op/embed.aspx?src="+"https://sikarliaapi.000webhostapp.com/rest/asu.docx";//+"&embedded=true";
              //var src = "https://docs.google.com/viewerng/viewer?url="+"https://sikarliaapi.000webhostapp.com/rest/asu.docx"+"&embedded=true";
              var src = 'https://docs.google.com/viewer?url=http://sikarliaapi.000webhostapp.com/rest/previewDocx/'+dataKontrak.userid+'.docx&embedded=true';
              try{
                document.getElementById("viewer").src = src;
                setTimeout(()=>{
                  document.getElementById("viewer").src = src;
                },300)
                setTimeout(()=>{
                  document.getElementById("viewer").src = src;
                },300)
                setTimeout(()=>{
                  document.getElementById("viewer").src = src;
                },300)
              }catch(e){
                
              }
              
            })
          };
        }
        catch(e){
          console.log(e);
        }
        return;
      }
      saveAs(out, dataKontrak.namaPekerjaan+'_output.docx');
    });
  };



function setTanggal(dateInput,type=null){
  if(dateInput==null){
    return null;
  }
  var arrbulan =["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  var arrhari = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"]
  var dateString = dateInput.split("-");
  var day = dateString[2];
  var month = dateString[1]-1;
  var year = dateString[0];
  var d = new Date(dateString[0],dateString[1]-1,dateString[2]);
  var hari = arrhari[d.getDay()];
  var output = [hari+",", day, arrbulan[month], year].join(" ");
  if(type=="tgl"){
    return [day, arrbulan[month], year].join(" ");
  }
  if(type=="day"){
    return hari.toUpperCase();
  }
  if(type=="dd"){
    return angkaTerbilang(day).toUpperCase();
  }
  if(type=="mm"){
    return arrbulan[month].toUpperCase();
  }
  if(type=="yy"){
    return angkaTerbilang(year).toUpperCase();
  }
  return output;
} 

function getMonth(dateInput){
  var dateString = dateInput.split("-");
  return dateString[1];
}

function setTabelHPS(dtTabel){
  var tblFIX = [];
  dtTabel.map((d,index)=>{
    var row = {
      no: index+1,
      descr: d.descr,
      qty: d.qty,
      freq: d.freq,
      unitprice: d.unitprice,
      total: d.total,
    }
    tblFIX.push(row);
  })

  return tblFIX;
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

function uppercaseFirstLetter(text){
  return text[0].toUpperCase() + text.slice(1).toLowerCase();
}

function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  // Directly return the joined string
  return splitStr.join(' '); 
}

function getDataSet(dataKontrak, hps2){
  if(dataKontrak.tipeKontrak == '200up'){
    return {
      namaPekerjaanCap: dataKontrak.namaPekerjaan.toUpperCase(),
      namaPekerjaan: titleCase(dataKontrak.namaPekerjaan),
      suratPermintaanPPK: setTanggal(dataKontrak.suratPermintaanPPK),
      pengadaanBarJas: setTanggal(dataKontrak.pengadaanBarJas),
      HPS: setTanggal(dataKontrak.HPS),
      penawaranRKS: setTanggal(dataKontrak.penawaranRKS),
      pengajuanPenawaran: setTanggal(dataKontrak.pengajuanPenawaran),
      undanganEvaluasi: setTanggal(dataKontrak.undanganEvaluasi),
      evaluasi: setTanggal(dataKontrak.evaluasi),
      penetapanPenyedia: setTanggal(dataKontrak.penetapanPenyedia),
      suratKesanggupan: setTanggal(dataKontrak.suratKesanggupan),
      laporanPelaksanaan: setTanggal(dataKontrak.laporanPelaksanaan),
      suratPemesanan: setTanggal(dataKontrak.suratPemesanan),
      penandatangananKontrak: setTanggal(dataKontrak.penandatangananKontrak),
      pelaksanaanPekerjaan: dataKontrak.pelaksanaanPekerjaan,
      pelaksanaanPekerjaantblg: angkaTerbilang(dataKontrak.pelaksanaanPekerjaan),
      penyelesaianPekerjaan: setTanggal(dataKontrak.penyelesaianPekerjaan),
      pembayaran: setTanggal(dataKontrak.pembayaran),

      tglsuratPermintaanPPK: setTanggal(dataKontrak.suratPermintaanPPK,"tgl"),
      tglpengadaanBarJas: setTanggal(dataKontrak.pengadaanBarJas,"tgl"),
      tglHPS: setTanggal(dataKontrak.HPS,"tgl"),
      tglpenawaranRKS: setTanggal(dataKontrak.penawaranRKS,"tgl"),
      tglpengajuanPenawaran: setTanggal(dataKontrak.pengajuanPenawaran,"tgl"),
      tglundanganEvaluasi: setTanggal(dataKontrak.undanganEvaluasi,"tgl"),
      tglevaluasi: setTanggal(dataKontrak.evaluasi,"tgl"),
      tglpenetapanPenyedia: setTanggal(dataKontrak.penetapanPenyedia,"tgl"),
      tglSuratKesanggupan: setTanggal(dataKontrak.suratKesanggupan,"tgl"),
      tgllaporanPelaksanaan: setTanggal(dataKontrak.laporanPelaksanaan,"tgl"),
      tglsuratPemesanan: setTanggal(dataKontrak.suratPemesanan,"tgl"),
      tglpenandatangananKontrak: setTanggal(dataKontrak.penandatangananKontrak,"tgl"),
      tglpenyelesaianPekerjaan: setTanggal(dataKontrak.penyelesaianPekerjaan,"tgl"),
      tglpembayaran: setTanggal(dataKontrak.pembayaran,"tgl"),

      m1: getMonth(dataKontrak.suratPermintaanPPK),
      m2: getMonth(dataKontrak.pengadaanBarJas),
      m3: getMonth(dataKontrak.HPS),
      m4: getMonth(dataKontrak.penawaranRKS),
      m5: getMonth(dataKontrak.pengajuanPenawaran),
      m6: getMonth(dataKontrak.undanganEvaluasi),
      m7: getMonth(dataKontrak.evaluasi),
      m8: getMonth(dataKontrak.penetapanPenyedia),
      m9: getMonth(dataKontrak.suratKesanggupan),
      m10: getMonth(dataKontrak.laporanPelaksanaan),
      m11: getMonth(dataKontrak.suratPemesanan),
      m12: getMonth(dataKontrak.penandatangananKontrak),
      m14: getMonth(dataKontrak.penyelesaianPekerjaan),
      m15: getMonth(dataKontrak.pembayaran),

      namaPerusahaan: dataKontrak.namaPerusahaan,
      namaPerusahaanCap: dataKontrak.namaPerusahaan.toUpperCase(),
      alamatPerusahaan: dataKontrak.alamatPerusahaan,
      namaDirektur: dataKontrak.namaDirektur,
      npwpPerusahaan: dataKontrak.npwpPerusahaan,
      jabatan: dataKontrak.jabatan,

      namaGroupPokja: dataKontrak.namaGroupPokja,
      namaGroupPokja: dataKontrak.namaGroupPokja,
      pokja1: dataKontrak.pokja1,
      pokja2: dataKontrak.pokja2,
      pokja3: dataKontrak.pokja3,
      pokja4: dataKontrak.pokja4,
      pokja5: dataKontrak.pokja5,
      nipPokja1: dataKontrak.nipPokja1,

      hps: setTabelHPS(dataKontrak.TABEL),
      hpsSUM: hps2,
      hrgtotal: commafy(dataKontrak.hrgtotal),
      hrgtotaltb: angkaTerbilang(dataKontrak.hrgtotal),

      dayEvaluasi:setTanggal(dataKontrak.evaluasi, "day"),
      dateEvaluasi:setTanggal(dataKontrak.evaluasi, "dd"),
      monthEvaluasi:setTanggal(dataKontrak.evaluasi, "mm"),
      yearEvaluasi:setTanggal(dataKontrak.evaluasi, "yy"),

      daypenandatangananKontrak:setTanggal(dataKontrak.penandatangananKontrak, "day"),
      datepenandatangananKontrak:setTanggal(dataKontrak.penandatangananKontrak, "dd"),
      monthpenandatangananKontrak:setTanggal(dataKontrak.penandatangananKontrak, "mm"),
      yearpenandatangananKontrak:setTanggal(dataKontrak.penandatangananKontrak, "yy"),

      monthpdtKontrak: uppercaseFirstLetter(setTanggal(dataKontrak.penandatangananKontrak, "mm")),
      
      daypenyelesaianPekerjaan:setTanggal(dataKontrak.penyelesaianPekerjaan, "day"),
      datepenyelesaianPekerjaan:setTanggal(dataKontrak.penyelesaianPekerjaan, "dd"),
      monthpenyelesaianPekerjaan:setTanggal(dataKontrak.penyelesaianPekerjaan, "mm"),
      yearpenyelesaianPekerjaan:setTanggal(dataKontrak.penyelesaianPekerjaan, "yy"),

      daypembayaran:setTanggal(dataKontrak.pembayaran, "day"),
      datepembayaran:setTanggal(dataKontrak.pembayaran, "dd"),
      monthpembayaran:setTanggal(dataKontrak.pembayaran, "mm"),
      yearpembayaran:setTanggal(dataKontrak.pembayaran, "yy"),

      satPelaksanaanPkj:dataKontrak.satPlkPkj,
      jenisPengadaan:dataKontrak.jenisPengadaan,
    }
  }
  else{
    return {
      namaPekerjaanCap: dataKontrak.namaPekerjaan.toUpperCase(),
      namaPekerjaan: titleCase(dataKontrak.namaPekerjaan),
      suratPermintaanPPK: setTanggal(dataKontrak.suratPermintaanPPK),
      pengadaanBarJas: setTanggal(dataKontrak.pengadaanBarJas),
      HPS: setTanggal(dataKontrak.HPS),
      penawaranRKS: setTanggal(dataKontrak.penawaranRKS),
      pengajuanPenawaran: setTanggal(dataKontrak.pengajuanPenawaran),
      undanganEvaluasi: setTanggal(dataKontrak.undanganEvaluasi),
      evaluasi: setTanggal(dataKontrak.evaluasi),
      penetapanPenyedia: setTanggal(dataKontrak.penetapanPenyedia),
      laporanPelaksanaan: setTanggal(dataKontrak.laporanPelaksanaan),
      suratPemesanan: setTanggal(dataKontrak.suratPemesanan),
      penandatangananKontrak: setTanggal(dataKontrak.penandatangananKontrak),
      pelaksanaanPekerjaan: dataKontrak.pelaksanaanPekerjaan,
      pelaksanaanPekerjaantblg: angkaTerbilang(dataKontrak.pelaksanaanPekerjaan),
      penyelesaianPekerjaan: setTanggal(dataKontrak.penyelesaianPekerjaan),
      pembayaran: setTanggal(dataKontrak.pembayaran),

      tglsuratPermintaanPPK: setTanggal(dataKontrak.suratPermintaanPPK,"tgl"),
      tglpengadaanBarJas: setTanggal(dataKontrak.pengadaanBarJas,"tgl"),
      tglHPS: setTanggal(dataKontrak.HPS,"tgl"),
      tglpenawaranRKS: setTanggal(dataKontrak.penawaranRKS,"tgl"),
      tglpengajuanPenawaran: setTanggal(dataKontrak.pengajuanPenawaran,"tgl"),
      tglundanganEvaluasi: setTanggal(dataKontrak.undanganEvaluasi,"tgl"),
      tglevaluasi: setTanggal(dataKontrak.evaluasi,"tgl"),
      tglpenetapanPenyedia: setTanggal(dataKontrak.penetapanPenyedia,"tgl"),
      tgllaporanPelaksanaan: setTanggal(dataKontrak.laporanPelaksanaan,"tgl"),
      tglsuratPemesanan: setTanggal(dataKontrak.suratPemesanan,"tgl"),
      tglpenandatangananKontrak: setTanggal(dataKontrak.penandatangananKontrak,"tgl"),
      tglpenyelesaianPekerjaan: setTanggal(dataKontrak.penyelesaianPekerjaan,"tgl"),
      tglpembayaran: setTanggal(dataKontrak.pembayaran,"tgl"),

      m1: getMonth(dataKontrak.suratPermintaanPPK),
      m2: getMonth(dataKontrak.pengadaanBarJas),
      m3: getMonth(dataKontrak.HPS),
      m4: getMonth(dataKontrak.penawaranRKS),
      m5: getMonth(dataKontrak.pengajuanPenawaran),
      m6: getMonth(dataKontrak.undanganEvaluasi),
      m7: getMonth(dataKontrak.evaluasi),
      m8: getMonth(dataKontrak.penetapanPenyedia),
      m9: getMonth(dataKontrak.laporanPelaksanaan),
      m10: getMonth(dataKontrak.suratPemesanan),
      m11: getMonth(dataKontrak.penandatangananKontrak),
      m13: getMonth(dataKontrak.penyelesaianPekerjaan),
      m14: getMonth(dataKontrak.pembayaran),

      namaPerusahaan: dataKontrak.namaPerusahaan,
      namaPerusahaanCap: dataKontrak.namaPerusahaan.toUpperCase(),
      alamatPerusahaan: dataKontrak.alamatPerusahaan,
      namaDirektur: dataKontrak.namaDirektur,
      npwpPerusahaan: dataKontrak.npwpPerusahaan,

      namaPerusahaanPembanding1: dataKontrak.namaPerusahaanPembanding1!=''?dataKontrak.namaPerusahaanPembanding1:'PT. XXXXXX (Perusahaan Pembanding 1)',
      alamatPerusahaanPembanding1: dataKontrak.alamatPerusahaanPembanding1!=''?dataKontrak.alamatPerusahaanPembanding1:'(Alamat Perusahaan Pembanding 1)',
      namaPerusahaanPembanding2: dataKontrak.namaPerusahaanPembanding2!=''?dataKontrak.namaPerusahaanPembanding2:'PT. YYYYY (Perusahaan Pembanding 2)',
      alamatPerusahaanPembanding2: dataKontrak.alamatPerusahaanPembanding2!=''?dataKontrak.alamatPerusahaanPembanding2:'(alamat perusahaan pembanding 2)',
      namaDirekturPembanding1: dataKontrak.namaDirekturPembanding1!=''?dataKontrak.namaDirekturPembanding1:'Nama Direktur',
      namaDirekturPembanding2: dataKontrak.namaDirekturPembanding2!=''?dataKontrak.namaDirekturPembanding2:'Nama Direktur',
      jabatanPmb1: dataKontrak.jabatanPmb1!=''?dataKontrak.jabatanPmb1:'Direktur Utama',
      jabatanPmb2: dataKontrak.jabatanPmb2!=''?dataKontrak.jabatanPmb2:'Direktur Utama',

      hps: setTabelHPS(dataKontrak.TABEL),
      hpsSUM: hps2,
      hrgtotal: commafy(dataKontrak.hrgtotal),
      hrgtotaltb: angkaTerbilang(dataKontrak.hrgtotal),

      dayEvaluasi:setTanggal(dataKontrak.evaluasi, "day"),
      dateEvaluasi:setTanggal(dataKontrak.evaluasi, "dd"),
      monthEvaluasi:setTanggal(dataKontrak.evaluasi, "mm"),
      yearEvaluasi:setTanggal(dataKontrak.evaluasi, "yy"),

      daypenandatangananKontrak:setTanggal(dataKontrak.penandatangananKontrak, "day"),
      datepenandatangananKontrak:setTanggal(dataKontrak.penandatangananKontrak, "dd"),
      monthpenandatangananKontrak:setTanggal(dataKontrak.penandatangananKontrak, "mm"),
      yearpenandatangananKontrak:setTanggal(dataKontrak.penandatangananKontrak, "yy"),

      monthpdtKontrak: uppercaseFirstLetter(setTanggal(dataKontrak.penandatangananKontrak, "mm")),
      
      daypenyelesaianPekerjaan:setTanggal(dataKontrak.penyelesaianPekerjaan, "day"),
      datepenyelesaianPekerjaan:setTanggal(dataKontrak.penyelesaianPekerjaan, "dd"),
      monthpenyelesaianPekerjaan:setTanggal(dataKontrak.penyelesaianPekerjaan, "mm"),
      yearpenyelesaianPekerjaan:setTanggal(dataKontrak.penyelesaianPekerjaan, "yy"),

      daypembayaran:setTanggal(dataKontrak.pembayaran, "day"),
      datepembayaran:setTanggal(dataKontrak.pembayaran, "dd"),
      monthpembayaran:setTanggal(dataKontrak.pembayaran, "mm"),
      yearpembayaran:setTanggal(dataKontrak.pembayaran, "yy"),

      satPelaksanaanPkj:dataKontrak.satPlkPkj,
    }
  }
}