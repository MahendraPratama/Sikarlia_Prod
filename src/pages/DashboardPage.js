import { AnnouncementCard, TodosCard } from 'components/Card';
import HorizontalAvatarList from 'components/HorizontalAvatarList';
import MapWithBubbles from 'components/MapWithBubbles';
import Page from 'components/Page';
import ProductMedia from 'components/ProductMedia';
import SupportTicket from 'components/SupportTicket';
import UserProgressTable from 'components/UserProgressTable';
import { IconWidget, NumberWidget } from 'components/Widget';
import { getStackLineChart, stackLineChartOptions } from 'demos/chartjs';
import logo200Image from 'assets/img/logo/logo_200.png';
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
} from 'react-icons/md';
import InfiniteCalendar from 'react-infinite-calendar';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardText,
  CardDeck,
  CardGroup,
  CardHeader,
  CardTitle,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
} from 'reactstrap';
import { getColor } from 'utils/colors';

const today = new Date();
const lastWeek = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 7,
);

class DashboardPage extends React.Component {
  constructor(props){
    super(props)
    this.state = {
        userid:null,
        password:false,
        data: null,
        message: null,
    };
  }
  componentDidMount() {
    // this is needed, because InfiniteCalendar forces window scroll
    window.scrollTo(0, 0);
  }
  handleClick = () => {
    this.props.history.push('/forms');
  };
  render() {
    const primaryColor = getColor('primary');
    const secondaryColor = getColor('secondary');

    return (
      <Page
        //className="DashboardPage bg-main-sikocak"
        //title="Dashboard"
        
        //breadcrumbs={[{ name: 'Dashboard', active: true }]}
      >
        <Row 
        style={{
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <Col lg={3} md={0} sm={0} xs={0}></Col>
          <Button lg={2} md={4} sm={12} xs={12}
            outline color="info"
            style={{ border:0 }}
          >
            <Card
              inverse
              className={`text-center`}
              style={{ height: 200, backgroundColor:'transparent', border:0 }}
            >
              <div className="text-center pb-4">
              <img
                src={logo200Image}
                className="rounded"
                style={{ width: 60, height: 60, cursor: 'pointer' }}
              />
            </div>
              <CardBody className="d-flex flex-column flex-wrap justify-content-center align-items-center">
                <CardTitle>Kontrak dibawah</CardTitle>
                <CardText>50 Juta</CardText>
              </CardBody>
            </Card>
          </Button>

          <Button lg={2} md={4} sm={12} xs={12}
            onClick={this.handleClick}
            outline color="info"
            style={{ border:0 }}
          >
            <Card
              inverse
              className={`text-center`}
              style={{ height: 200, backgroundColor:'transparent', border:0 }}
            >
              <div className="text-center pb-4">
              <img
                src={logo200Image}
                className="rounded"
                style={{ width: 60, height: 60, cursor: 'pointer' }}
              />
            </div>
              <CardBody className="d-flex flex-column flex-wrap justify-content-center align-items-center">
                <CardTitle>Kontrak</CardTitle>
                <CardText>50 - 200 Juta</CardText>
              </CardBody>
            </Card>
          </Button>

          <Button lg={2} md={4} sm={12} xs={12}
            //onClick={{}}
            outline color="info"
            style={{ border:0 }}
          >
            <Card
              inverse
              className={`text-center`}
              style={{ height: 200, backgroundColor:'transparent', border:0 }}
            >
              <div className="text-center pb-4">
              <img
                src={logo200Image}
                className="rounded"
                style={{ width: 60, height: 60, cursor: 'pointer' }}
              />
            </div>
              <CardBody className="d-flex flex-column flex-wrap justify-content-center align-items-center">
                <CardTitle>Kontrak diatas</CardTitle>
                <CardText>200 Juta</CardText>
              </CardBody>
            </Card>
          </Button>

          <Col lg={3} md={0} sm={0} xs={0}></Col>
        </Row>

        </Page>
    );
  }
}
export default DashboardPage;
