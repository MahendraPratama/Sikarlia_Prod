import Page from 'components/Page';
import React from 'react';
import {generateDocument} from '../docxtemplater/engine';


import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
} from 'reactstrap';

const urlFile= 'https://drive.google.com/u/0/uc?id=15uCHB-w4Xhz-pQAqwBzcil3AoRZB7f6U&export=download';
const path = window.location.origin  + '/kontrak50_200.docx';
const urlLocal = 'https://localhost/docxtemplate/kontrak50_200.docx';
const dataKontrak = {
  namaPekerjaan: null,
  suratPermintaanPPK: null,
}
class FormPage extends React.Component {
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
    };
    //this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const key = target.name;

    dataKontrak[target.name] = value;
    // this.setState({
    //   [target.name]: value
    // });
  }
  handleSubmit = () => {
    generateDocument(dataKontrak);
  };

  render(){
    return (
      <Page>
        <br/>
        <Row>
          <Col>
          {/* <Card> */}
            {/* <CardHeader>Input Types</CardHeader> */}
            {/* <CardBody> */}
              <Form onSubmit={this.handleSubmit}>
              <Card>
                <CardHeader>Input Nama Pekerjaan</CardHeader>
                <CardBody>
                  <Row>
                    <Col xl={12} lg={12} md={12}>
                      <FormGroup row>
                        <Label for="namaPekerjaan" sm={2}>
                          Nama Pekerjaan
                        </Label>
                        <Col sm={9}>
                          <Input
                            type="text"
                            name="namaPekerjaan"
                            placeholder=""
                            onChange={this.handleInputChange}
                          />
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <br/>
              <Card>
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
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="pengadaanBarJas" sm={6}>
                          Pengadaan Barang dan Jasa
                        </Label>
                        <Col sm={5}>
                          <Input
                            type="date"
                            name="pengadaanBarJas"
                            id="pengadaanBarJas"
                            placeholder="date placeholder"
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="HPS" sm={6}>
                          HPS
                        </Label>
                        <Col sm={5}>
                          <Input
                            type="date"
                            name="HPS"
                            id="HPS"
                            placeholder="date placeholder"
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="penawaranRKS" sm={6}>
                          Permintaan Penawaran dilampiri RKS
                        </Label>
                        <Col sm={5}>
                          <Input
                            type="date"
                            name="penawaranRKS"
                            id="penawaranRKS"
                            placeholder="date placeholder"
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="pengajuanPenawaran" sm={6}>
                          Pengajuan Penawaran (Dilampiri SIUP, Akte Notaris, NPWP, Bukti Pembayaran pajak Terakhir)
                        </Label>
                        <Col sm={5}>
                          <Input
                            type="date"
                            name="pengajuanPenawaran"
                            id="pengajuanPenawaran"
                            placeholder="date placeholder"
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="undanganEvaluasi" sm={6}>
                          {'Undangan Evaluasi Klarifikasi & negosiasi'}
                        </Label>
                        <Col sm={5}>
                          <Input
                            type="date"
                            name="undanganEvaluasi"
                            placeholder="date placeholder"
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="evaluasi" sm={6}>
                          {"Evaluasi Klarifikasi & negosiasi"}
                        </Label>
                        <Col sm={5}>
                          <Input
                            type="date"
                            name="evaluasi"
                            id="evaluasi"
                            placeholder="date placeholder"
                          />
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
                            type="date"
                            name="penetapanPenyedia"
                            id="penetapanPenyedia"
                            placeholder="date placeholder"
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="laporanPelaksanaan" sm={6}>
                          Laporan Pelaksanaan Pengadaan Barang dan Jasa
                        </Label>
                        <Col sm={5}>
                          <Input
                            type="date"
                            name="laporanPelaksanaan"
                            id="laporanPelaksanaan"
                            placeholder="date placeholder"
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="suratPemesanan" sm={6}>
                          Surat Pemesanan
                        </Label>
                        <Col sm={5}>
                          <Input
                            type="date"
                            name="suratPemesanan"
                            id="suratPemesanan"
                            placeholder="date placeholder"
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="penandatangananKontrak" sm={6}>
                          Penandatanganan Kontrak SPK
                        </Label>
                        <Col sm={5}>
                          <Input
                            type="date"
                            name="penandatangananKontrak"
                            id="penandatangananKontrak"
                            placeholder="date placeholder"
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="pelaksanaanPekerjaan" sm={6}>
                          Pelaksanaan Pekerjaan
                        </Label>
                        <Col sm={3}>
                          <Input
                            type="number"
                            name="pelaksanaanPekerjaan"
                            id="pelaksanaanPekerjaan"
                            placeholder="hari kalender"
                          />
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
                            type="date"
                            name="penyelesaianPekerjaan"
                            id="penyelesaianPekerjaan"
                            placeholder="date placeholder"
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="pembayaran" sm={6}>
                          BA Pembayaran 
                        </Label>
                        <Col sm={5}>
                          <Input
                            type="date"
                            name="pembayaran"
                            id="pembayaran"
                            placeholder="date placeholder"
                          />
                        </Col>
                      </FormGroup>
                    </Col>
                    <hr/>
                    <Col xl={12} lg={12} md={12}>
                      <FormGroup row>
                        <Col sm={{ offset: 10 }}>
                          <Button color="danger">Back</Button> &nbsp;&nbsp;
                          <Button color="info" onClick={this.handleSubmit}>Next</Button>
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
    );
  }
};

export default FormPage;
