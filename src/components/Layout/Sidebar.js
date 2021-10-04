import logo200Image from 'assets/img/logo/logo_login.png';
import sidebarBgImage from 'assets/img/sidebar/sidebar.png';
import SourceLink from 'components/SourceLink';
import React from 'react';
import '../../styles/custom/custom.css'
import { FaGithub } from 'react-icons/fa';
import {
  MdAccountCircle,
  MdArrowDropDownCircle,
  MdBorderAll,
  MdBrush,
  MdChromeReaderMode,
  MdDashboard,
  MdExtension,
  MdGroupWork,
  MdInsertChart,
  MdKeyboardArrowDown,
  MdNotificationsActive,
  MdPages,
  MdRadioButtonChecked,
  MdSend,
  MdStar,
  MdTextFields,
  MdViewCarousel,
  MdViewDay,
  MdViewList,
  MdWeb,
  MdWidgets,
  MdAccountBox,
  MdRateReview,
  MdDescription,
} from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import {
  // UncontrolledTooltip,
  Collapse,
  Nav,
  Navbar,
  NavItem,
  NavLink as BSNavLink,
} from 'reactstrap';
import bn from 'utils/bemnames';

const sidebarBackground = {
  backgroundImage: `url("${sidebarBgImage}")`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};

const navComponents = [
  { to: '/buttons', name: 'buttons', exact: false, Icon: MdRadioButtonChecked },
  {
    to: '/button-groups',
    name: 'button groups',
    exact: false,
    Icon: MdGroupWork,
  },
  { to: '/forms', name: 'forms', exact: false, Icon: MdChromeReaderMode },
  { to: '/input-groups', name: 'input groups', exact: false, Icon: MdViewList },
  {
    to: '/dropdowns',
    name: 'dropdowns',
    exact: false,
    Icon: MdArrowDropDownCircle,
  },
  { to: '/badges', name: 'badges', exact: false, Icon: MdStar },
  { to: '/alerts', name: 'alerts', exact: false, Icon: MdNotificationsActive },
  { to: '/progress', name: 'progress', exact: false, Icon: MdBrush },
  { to: '/modals', name: 'modals', exact: false, Icon: MdViewDay },
];

const navContents = [
  { to: '/typography', name: 'typography', exact: false, Icon: MdTextFields },
  { to: '/tables', name: 'tables', exact: false, Icon: MdBorderAll },
];

const pageContents = [
  { to: '/login', name: 'login / signup', exact: false, Icon: MdAccountCircle },
  {
    to: '/login-modal',
    name: 'login modal',
    exact: false,
    Icon: MdViewCarousel,
  },
];

const navItems = [
  //{ to: '/dashboard', name: 'dashboard', exact: true, Icon: MdDashboard },
  { to: '/cards', name: 'cards', exact: false, Icon: MdWeb },
  { to: '/charts', name: 'charts', exact: false, Icon: MdInsertChart },
  { to: '/widgets', name: 'widgets', exact: false, Icon: MdWidgets },
];

const navKontrak = [
  { to: '/form50200PL', name: '50 - 200 PL', exact: true, Icon: MdChromeReaderMode },
  { to: '/form50200', name: '50 - 200', exact: false, Icon: MdChromeReaderMode },
  { to: '/form200up', name: 'Diatas 200 Juta', exact: false, Icon: MdChromeReaderMode },
]
const navKontrakKonsultasi = [
  { to: '/form100PL', name: 'Dibawah 100 Juta PL', exact: true, Icon: MdChromeReaderMode },
  { to: '/form100', name: 'Dibawah 100 Juta', exact: false, Icon: MdChromeReaderMode },
  { to: '/form100up', name: 'Diatas 100 Juta', exact: false, Icon: MdChromeReaderMode },
]

const bem = bn.create('sidebar');

class Sidebar extends React.Component {
  state = {
    isOpenComponents: true,
    isOpenContents: true,
    isOpenPages: true,
    isOpenInputKontrak: true,
    isOpenJasaLainnya: true,
    isOpenJasaKonsultasi: true,
  };

  handleClick = name => () => {
    this.setState(prevState => {
      const isOpen = prevState[`isOpen${name}`];

      return {
        [`isOpen${name}`]: !isOpen,
      };
    });
  };
  menuAdmin(){
    var userType = localStorage.getItem("user_type");
    var isAdmin = userType == 1 || userType == 0;
    if(isAdmin){
      return (
        <div>
        <NavItem key={1} className={bem.e('nav-item')}>
          <BSNavLink
          style={{color:"#000"}}
            id={`navItem-${'users'}-${1}`}
            //className="text-uppercase"
            tag={NavLink}
            to={'/users'}
            activeClassName="active"
            exact={true}
          >
            <MdAccountBox style={{color:"#146df3"}} className={bem.e('nav-item-icon')} />
            <span className="sideItm">{'Users'}</span>
          </BSNavLink>
        </NavItem>
        <NavItem key={1} className={bem.e('nav-item')}>
          <BSNavLink
            style={{color:"#000"}}
            id={`navItem-${'kontraksaya'}-${1}`}
            //className="text-uppercase"
            tag={NavLink}
            to={'/kontraksaya'}
            activeClassName="active"
            exact={true}
          >
            <MdRateReview style={{color:"#146df3"}} className={bem.e('nav-item-icon')} />
            <span className="sideItm">{'Semua Kontrak'}</span>
          </BSNavLink>
        </NavItem>
        </div>
      );
    }else{
      return (
        <NavItem key={1} className={bem.e('nav-item')}>
          <BSNavLink
            style={{color:"#000"}}
            id={`navItem-${'kontraksaya'}-${1}`}
            //className="text-uppercase"
            tag={NavLink}
            to={'/kontraksaya'}
            activeClassName="active"
            exact={true}
          >
            <MdRateReview style={{color:"#146df3"}} className={bem.e('nav-item-icon')} />
            <span className="sideItm">{'Kontrak Saya'}</span>
          </BSNavLink>
        </NavItem>
      );
    }
    
  }
  render() {
    return (
      // data-image={sidebarBgImage}
      <aside className={bem.b()} >
        <div className={bem.e('background')} style={sidebarBackground} />
        <div className={bem.e('content')}>
          <Navbar className="d-flex justify-content-between">
            &nbsp;
            <SourceLink className="navbar-brand d-flex">
              <img
                src={logo200Image}
                style={{marginTop:55,marginBottom:0}}
                width="168"
                height="46"
                className="pr-2"
                alt=""
              />
              {/* <span className="text-white">
                SiKarlia
              </span> */}
            </SourceLink>
            &nbsp;
          </Navbar>
          
          <Nav vertical>
            <NavItem key={1} className={bem.e('nav-item')}>
              <BSNavLink
                style={{color:"#000"}}
                id={`navItem-${'dashboard'}-${1}`}
                //className="text-uppercase"
                tag={NavLink}
                to={'/dashboard'}
                activeClassName="active"
                exact={true}
              >
                <MdDashboard style={{color:"#146df3"}} className={bem.e('nav-item-icon')} />
                <span className="sideItm">{'Dashboard'}</span>
              </BSNavLink>
            </NavItem>
            {localStorage.getItem("user_type")==1||localStorage.getItem("user_type")==0?
            null:
            <div>
              <NavItem 
                className={bem.e('nav-item')}
                onClick={this.handleClick('JasaLainnya')}
              >
                <BSNavLink style={{color:"#000"}} className={bem.e('nav-item-collapse')}>
                  <div className="d-flex">
                    <MdDescription style={{color:"#146df3"}} className={bem.e('nav-item-icon')} />
                    <span className="sideItm align-self-start">{'Barang & Jasa Lainnya'}</span>
                  </div>
                  <MdKeyboardArrowDown
                  style={{color:"#146df3"}}
                    className={bem.e('nav-item-icon')}
                    style={{
                      padding: 0,
                      transform: this.state.isOpenJasaLainnya
                        ? 'rotate(0deg)'
                        : 'rotate(-90deg)',
                      transitionDuration: '0.3s',
                      transitionProperty: 'transform',
                    }}
                  />
                </BSNavLink>
              </NavItem>
              <Collapse isOpen={this.state.isOpenJasaLainnya}>
              {navKontrak.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink 
                    style={{color:"#000"}}
                    id={`navItem-${name}-${index}`}
                    //className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    {/* <Icon className={bem.e('nav-item-icon')} /> */}
                    
                    <span style={{marginLeft:30}} className="sideItm">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
              </Collapse>


              <NavItem 
                className={bem.e('nav-item')}
                onClick={this.handleClick('JasaKonsultasi')}
              >
                <BSNavLink style={{color:"#000"}} className={bem.e('nav-item-collapse')}>
                  <div className="d-flex">
                    <MdDescription style={{color:"#146df3"}} className={bem.e('nav-item-icon')} />
                    <span className="sideItm align-self-start">{'Jasa Konsultasi'}</span>
                  </div>
                  <MdKeyboardArrowDown
                  style={{color:"#146df3"}}
                    className={bem.e('nav-item-icon')}
                    style={{
                      padding: 0,
                      transform: this.state.isOpenJasaKonsultasi
                        ? 'rotate(0deg)'
                        : 'rotate(-90deg)',
                      transitionDuration: '0.3s',
                      transitionProperty: 'transform',
                    }}
                  />
                </BSNavLink>
              </NavItem>
              <Collapse isOpen={this.state.isOpenJasaKonsultasi}>
              {navKontrakKonsultasi.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink 
                    style={{color:"#000"}}
                    id={`navItem-${name}-${index}`}
                    //className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    {/* <Icon className={bem.e('nav-item-icon')} /> */}
                    
                    <span style={{marginLeft:30}} className="sideItm">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
              </Collapse>
            
 
            </div>
            }

            {this.menuAdmin()}            
          </Nav>
        </div>
      </aside>
    );
  }
}

export default Sidebar;
