import { STATE_LOGIN, STATE_SIGNUP } from 'components/AuthForm';
import GAListener from 'components/GAListener';
import { EmptyLayout, LayoutRoute, MainLayout } from 'components/Layout';
import PageSpinner from 'components/PageSpinner';
import AuthPage from 'pages/AuthPage';
import ViewSuratPage from 'pages/ViewSurat';
import React from 'react';
import componentQueries from 'react-component-queries';
import { BrowserRouter, Redirect, Route, Switch, withRouter } from 'react-router-dom';
//import Profile from './pages/Profile';
import './styles/reduction.scss';

const AlertPage = React.lazy(() => import('pages/AlertPage'));
const AuthModalPage = React.lazy(() => import('pages/AuthModalPage'));
const BadgePage = React.lazy(() => import('pages/BadgePage'));
const ButtonGroupPage = React.lazy(() => import('pages/ButtonGroupPage'));
const ButtonPage = React.lazy(() => import('pages/ButtonPage'));
const CardPage = React.lazy(() => import('pages/CardPage'));
const ChartPage = React.lazy(() => import('pages/ChartPage'));
const DashboardPage = React.lazy(() => import('pages/DashboardReal'));
const ViewSurat = React.lazy(() => import('pages/ViewSurat'));
const DropdownPage = React.lazy(() => import('pages/DropdownPage'));
const FormPage = React.lazy(() => import('pages/FormPage'));
const Profile = React.lazy(() => import('pages/Profile'));
const Users = React.lazy(() => import('pages/Users'));
const FormKontrak200Up = React.lazy(() => import('pages/FormKontrak200Up'));
const FormKontrak50200 = React.lazy(() => import('pages/FormKontrak50200'));
const FormKontrak50200PL = React.lazy(() => import('pages/FormKontrak50200PL'));
const KuitansiGUPage = React.lazy(() => import('pages/KuitansiGUPage'));
const KuitansiPerjadin = React.lazy(() => import('pages/KuitansiPerjadin'));
const InputGroupPage = React.lazy(() => import('pages/InputGroupPage'));
const ModalPage = React.lazy(() => import('pages/ModalPage'));
const ProgressPage = React.lazy(() => import('pages/ProgressPage'));
const TablePage = React.lazy(() => import('pages/TablePage'));
const TypographyPage = React.lazy(() => import('pages/TypographyPage'));
const WidgetPage = React.lazy(() => import('pages/WidgetPage'));
const KontrakSaya = React.lazy(() => import('pages/KontrakSaya'));
const Slider = React.lazy(() => import('pages/Slider'));
const Persuratan = React.lazy(() => import('pages/PersuratanEO'));
const KuitansiAjah = React.lazy(() => import('pages/KuitansiAjah'));

const getBasename = () => {
  return `/${process.env.PUBLIC_URL.split('/').pop()}`;
};


class App extends React.Component {
  componentDidMount() {
    this.cekSession();
    this.expireSession();
  }
  componentWillUpdate(){
    this.expireSession();
    //this.cekSession();
  }

  cekSession(){
    var curLoc = window.location.href;
    var origin = window.location.origin;
    var curPath = curLoc.replace(origin,'');
    var session = localStorage.getItem("user_session");
    
    if(curPath != "/"){
      var isViewSurat = curPath.includes("viewsurat");
      if(isViewSurat){
        return;
      }
      else if(session==null){
        window.location.href = "/";
        // console.log("Redir: " + origin + curLoc)
        // console.log(curLoc)
      }
    }
  }
  expireSession(){
    var hours = 1; // Reset when storage is more than 1hours
    var now = new Date().getTime();
    var setupTime = localStorage.getItem('setupTime');
    if (setupTime == null) {
        localStorage.setItem('setupTime', now);
        console.log("setupTime : " + now);
        //window.location.href = "/";
    } else {
        if(now-setupTime > hours*60*60*1000) {
            localStorage.clear();
            console.log("logout");
            //localStorage.setItem('setupTime', now);
            window.location.href = "/";
        }
    }
  }

  render() {
    return (
      <BrowserRouter basename={getBasename()}>
        <GAListener>
          <Switch>
            <LayoutRoute
              exact
              path="/"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_LOGIN} />
              )}
            />
            <LayoutRoute
              exact
              path="/signup"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_SIGNUP} />
              )}
            />
            <LayoutRoute
              exact
              path="/viewsurat"
              layout={EmptyLayout}
              component={props => (
                <ViewSuratPage />
              )}
            />

            <MainLayout breakpoint={this.props.breakpoint}>
              <React.Suspense fallback={<PageSpinner />}>
                <Route exact path="/dashboard" component={DashboardPage} />
                <Route exact path="/persuratan" component={Persuratan} />
                <Route exact path="/users" component={Users} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/form100up" component={(routeProps)=> <FormKontrak50200 tipe="100up"  {...routeProps}/>} />
                <Route exact path="/form200up" component={(routeProps)=> <FormKontrak50200 tipe="200up"  {...routeProps}/>} />
                <Route exact path="/form100PL" component={(routeProps)=> <FormKontrak50200 tipe="100PL"  {...routeProps}/>} />
                <Route exact path="/form50200PL" component={(routeProps)=> <FormKontrak50200 tipe="50200PL"  {...routeProps}/>} />
                <Route exact path="/form100" component={(routeProps)=> <FormKontrak50200 tipe="100NonPL"  {...routeProps}/>} />
                <Route exact path="/form50200" component={(routeProps)=> <FormKontrak50200 tipe="50200NonPL"  {...routeProps}/>} />
                <Route exact path="/kuitansiPerjadin" component={KuitansiPerjadin} />
                <Route exact path="/kontraksaya" component={KontrakSaya} />
                <Route exact path="/kuitansiAjah" component={KuitansiAjah} />
              </React.Suspense>
            </MainLayout>
            <Redirect to="/dashboard" />
          </Switch>
        </GAListener>
      </BrowserRouter>
    );
  }
}

const query = ({ width }) => {
  if (width < 575) {
    return { breakpoint: 'xs' };
  }

  if (576 < width && width < 767) {
    return { breakpoint: 'sm' };
  }

  if (768 < width && width < 991) {
    return { breakpoint: 'md' };
  }

  if (992 < width && width < 1199) {
    return { breakpoint: 'lg' };
  }

  if (width > 1200) {
    return { breakpoint: 'xl' };
  }

  return { breakpoint: 'xs' };
};

export default componentQueries(query)(App);
