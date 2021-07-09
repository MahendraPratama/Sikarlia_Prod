import { AnnouncementCard, TodosCard } from 'components/Card';
import HorizontalAvatarList from 'components/HorizontalAvatarList';
import MapWithBubbles from 'components/MapWithBubbles';
import Page from 'components/Page';
import ProductMedia from 'components/ProductMedia';
import SupportTicket from 'components/SupportTicket';
import UserProgressTable from 'components/UserProgressTable';
import { IconWidget, NumberWidget } from 'components/Widget';
import { getStackLineChart, stackLineChartOptions } from 'demos/chartjs';
import {
  avatarsData,
  chartjs,
  productsData,
  supportTicketsData,
  todosData,
  userProgressTableData,
} from 'demos/dashboardPage';
import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  MdBubbleChart,
  MdInsertChart,
  MdPersonPin,
  MdPieChart,
  MdRateReview,
  MdShare,
  MdShowChart,
  MdThumbUp,
  MdLibraryBooks,MdDelete,MdCloudUpload,MdWarning,MdEdit,MdCheckCircle,MdSearch,
} from 'react-icons/md';
import InfiniteCalendar from 'react-infinite-calendar';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardDeck,
  CardGroup,
  CardHeader,
  CardTitle,
  Col,
  ListGroup,
  ListGroupItem, Table,
  Row,
} from 'reactstrap';
import { getColor } from 'utils/colors';

const today = new Date();
const lastWeek = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 7,
);
var iconWidgetsData = [
  {
    bgColor: 'warning',
    icon: MdLibraryBooks,
    title: 'Diatas 200 Juta',
    subtitle: 'kontrak',
    jml:0,
  },
  {
    bgColor: 'success',
    icon: MdLibraryBooks,
    title: '50-200 Juta',
    subtitle: 'kontrak',
    jml:0,
  },
  {
    bgColor: 'info',
    icon: MdLibraryBooks,
    title: '50-200 Juta PL',
    subtitle: 'kontrak',
    jml:0,
  },
  
];
class DashboardPage extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      userid:null,
      password:false,
      data: [],
      datakontrak: {
        namaPekerjaan: null,
        suratPermintaanPPK: null
      },
      message:'',
      search:'',
      Data: [],
      sumAllKontrak:0,
      dataRender:[]
    };
    
  }
  componentDidMount() {
    if(!localStorage.getItem('setupTime')){
      window.location.href = '/';
    }
    // this is needed, because InfiniteCalendar forces window scroll
    window.scrollTo(0, 0);
    this.loadDashboard();
  }

  loadDashboard(){
    const requestOptions = {
      method: 'POST',
      //headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userid: localStorage.getItem("user_session") })
    };
    fetch(process.env.REACT_APP_URL_API+'/rest/countKontrak.php', requestOptions)
        .then(response => response.json())
        .then(respon => {
          var dataAPI = respon;
          if(dataAPI.response_code == 200){
            var sumAllKontrak = 0;
            console.log(dataAPI.data);
            dataAPI.data.map(
              ({tipeKontrak, jml}, index)=>{
                iconWidgetsData[index].jml = jml;
                sumAllKontrak += jml;
              });
            this.setState({Data:iconWidgetsData, sumAllKontrak:sumAllKontrak});
          }else{
            
          }
        });
    const requestOptions2 = {
      method: 'POST',
      //headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userid: localStorage.getItem("user_session") })
    };
    fetch(process.env.REACT_APP_URL_API+'/rest/kontrakTerbaru.php', requestOptions2)
        .then(response => response.json())
        .then(respon => {
          var dataAPI = respon;
          if(dataAPI.response_code != 200){
            this.setState({ message: dataAPI.message });
          }else{
            this.setState({ data: dataAPI.data, dataRender:dataAPI.data });
            //this.handlePageChange(1)
          }
        });
  }

  render() {
    const primaryColor = getColor('primary');
    const secondaryColor = getColor('secondary');

    return (
      <Page
        className="DashboardPage"
        title="Dashboard"
        breadcrumbs={[{ name: 'Dashboard', active: true }]}
      >
        <Row>
        {this.state.Data.map(
          ({ bgColor, icon, title, subtitle, jml, ...restProps }, index) => (
            <Col key={index} lg={4} md={6} sm={6} xs={12} className="mb-3">
              {/* <IconWidget
                bgColor={bgColor}
                icon={icon}
                title={title}
                subtitle={subtitle}
                {...restProps}
              >
              </IconWidget> */}
              <NumberWidget
                title={title}
                subtitle={subtitle}
                number={jml + " Kontrak"}
                color="secondary"
                progress={{
                  value: jml*this.state.sumAllKontrak/100,
                  label: '',
                }}
              />
            </Col>
          )
        )}
        </Row>
        {/* <Row>
          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget
              title="Total Profit"
              subtitle="This month"
              number="9.8k"
              color="secondary"
              progress={{
                value: 75,
                label: 'Last month',
              }}
            />
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget
              title="Monthly Visitors"
              subtitle="This month"
              number="5,400"
              color="secondary"
              progress={{
                value: 45,
                label: 'Last month',
              }}
            />
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget
              title="New Users"
              subtitle="This month"
              number="3,400"
              color="secondary"
              progress={{
                value: 90,
                label: 'Last month',
              }}
            />
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget
              title="Bounce Rate"
              subtitle="This month"
              number="38%"
              color="secondary"
              progress={{
                value: 60,
                label: 'Last month',
              }}
            />
          </Col>
        </Row> */}

        {/* <Row>
          <Col lg="8" md="12" sm="12" xs="12">
            <Card>
              <CardHeader>
                Total Revenue{' '}
                <small className="text-muted text-capitalize">This year</small>
              </CardHeader>
              <CardBody>
                <Line data={chartjs.line.data} options={chartjs.line.options} />
              </CardBody>
            </Card>
          </Col>

          <Col lg="4" md="12" sm="12" xs="12">
            <Card>
              <CardHeader>Total Expense</CardHeader>
              <CardBody>
                <Bar data={chartjs.bar.data} options={chartjs.bar.options} />
              </CardBody>
              <ListGroup flush>
                <ListGroupItem>
                  <MdInsertChart size={25} color={primaryColor} /> Cost of sales{' '}
                  <Badge color="secondary">$3000</Badge>
                </ListGroupItem>
                <ListGroupItem>
                  <MdBubbleChart size={25} color={primaryColor} /> Management
                  costs <Badge color="secondary">$1200</Badge>
                </ListGroupItem>
                <ListGroupItem>
                  <MdShowChart size={25} color={primaryColor} /> Financial costs{' '}
                  <Badge color="secondary">$800</Badge>
                </ListGroupItem>
                <ListGroupItem>
                  <MdPieChart size={25} color={primaryColor} /> Other operating
                  costs <Badge color="secondary">$2400</Badge>
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row> */}

        {/* <CardGroup style={{ marginBottom: '1rem' }}>
          <IconWidget
            bgColor="white"
            inverse={false}
            icon={MdThumbUp}
            title="50+ Likes"
            subtitle="People you like"
          />
          <IconWidget
            bgColor="white"
            inverse={false}
            icon={MdRateReview}
            title="10+ Reviews"
            subtitle="New Reviews"
          />
          <IconWidget
            bgColor="white"
            inverse={false}
            icon={MdShare}
            title="30+ Shares"
            subtitle="New Shares"
          />
        </CardGroup> */}

        {/* <Row>
          <Col md="6" sm="12" xs="12">
            <Card>
              <CardHeader>New Products</CardHeader>
              <CardBody>
                {productsData.map(
                  ({ id, image, title, description, right }) => (
                    <ProductMedia
                      key={id}
                      image={image}
                      title={title}
                      description={description}
                      right={right}
                    />
                  ),
                )}
              </CardBody>
            </Card>
          </Col>

          <Col md="6" sm="12" xs="12">
            <Card>
              <CardHeader>New Users</CardHeader>
              <CardBody>
                <UserProgressTable
                  headers={[
                    <MdPersonPin size={25} />,
                    'name',
                    'date',
                    'participation',
                    '%',
                  ]}
                  usersData={userProgressTableData}
                />
              </CardBody>
            </Card>
          </Col>
        </Row> */}
       <Row>
          <Col md="9" sm="12" xs="12">
            <Card inverse>
              <CardHeader inverse className="bg-gradient-primary">Kontrak Terbaru</CardHeader>
              <CardBody>
              <Table responsive {...{ ['striped' || 'default']: true }}>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Pekerjaan</th>
                      <th>Nilai Kontrak</th>
                      <th>Perusahaan Pemenang</th>
                      <th>Tipe Kontrak</th>
                      <th>Tanggal Input</th>
                      {/* <th>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.dataRender.map((dt,index)=>(
                      <tr key={index}>
                        <td scope="row">{index+1}</td>
                        <td>{dt.namaPekerjaan}</td>
                        <td>{commafy(dt.hrgtotal)}</td>
                        <td>{dt.namaPerusahaan}</td>
                        <td>{getNamaTipeKontrak(dt.tipeKontrak)}</td>
                        <td>{dt.date_created}</td>
                        {/* <td>
                          <Button 
                            color="secondary"
                            onClick={()=>{this.gotoEdit(((activePage*itemPerPage)-itemPerPage) + index)}}
                            size="sm"
                          ><MdEdit/></Button>&nbsp;                               
                          <Button 
                            style={{background:'rgb(230 14 20)', borderColor:'rgb(230 14 20)'}}
                            onClick={()=>{this.deleteData(((activePage*itemPerPage)-itemPerPage) + index)}}
                            size="sm"
                          ><MdDelete/></Button>                                
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        
          <Col lg="3" md="12" sm="12" xs="12">
            <InfiniteCalendar
              selected={today}
              minDate={lastWeek}
              width="100%"
              theme={{
                accentColor: primaryColor,
                floatingNav: {
                  background: secondaryColor,
                  chevron: primaryColor,
                  color: '#FFF',
                },
                headerColor: primaryColor,
                selectionColor: secondaryColor,
                textColor: {
                  active: '#FFF',
                  default: '#333',
                },
                todayColor: secondaryColor,
                weekdayColor: primaryColor,
              }}
            />
          </Col>

          </Row>

        {/* <CardDeck style={{ marginBottom: '1rem' }}>
          <Card body style={{ overflowX: 'auto','paddingBottom':'15px','height': 'fit-content','paddingTop': 'inherit'}}>
            <HorizontalAvatarList
              avatars={avatarsData}
              avatarProps={{ size: 50 }}
            />
          </Card>

          <Card body style={{ overflowX: 'auto','paddingBottom':'15px','height': 'fit-content','paddingTop': 'inherit'}}>
            <HorizontalAvatarList
              avatars={avatarsData}
              avatarProps={{ size: 50 }}
              reversed
            />
          </Card>
        </CardDeck> */}

        <Row>
          {/* <Col lg="4" md="12" sm="12" xs="12">
            <AnnouncementCard
              color="gradient-secondary"
              header="Announcement"
              avatarSize={60}
              name="Jamy"
              date="1 hour ago"
              text="Lorem ipsum dolor sit amet,consectetuer edipiscing elit,sed diam nonummy euismod tinciduntut laoreet doloremagna"
              buttonProps={{
                children: 'show',
              }}
              style={{ height: 500 }}
            />
          </Col> */}

          {/* <Col lg="4" md="12" sm="12" xs="12">
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <span>Support Tickets</span>
                  <Button>
                    <small>View All</small>
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                {supportTicketsData.map(supportTicket => (
                  <SupportTicket key={supportTicket.id} {...supportTicket} />
                ))}
              </CardBody>
            </Card>
          </Col>

          <Col lg="4" md="12" sm="12" xs="12">
            <TodosCard todos={todosData} />
          </Col> */}
        </Row>
      </Page>
    );
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
    return <Badge color="info" pill className="mr-1">50-200 PL</Badge>;
  }
  if(input=="50200NonPL"){
    return <Badge color="success" pill className="mr-1">50-200</Badge>;
  }
  if(input=="200up"){
    return <Badge color="warning" pill className="mr-1">Diatas 200</Badge>;
  }
}
export default DashboardPage;