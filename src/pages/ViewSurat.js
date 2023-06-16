import AuthForm, { STATE_LOGIN } from 'components/AuthForm';
import React from 'react';
import { Card, Col, Row } from 'reactstrap';

class viewsurat extends React.Component {
  
    componentDidMount(){
        const params = new URLSearchParams(window.location.search);
        const paramValue = params.get("no");

        
        if(paramValue==null){
            //this.props.history.push('/');
            return;
        }
        var urlG = 'https://docs.google.com/gview?url=';
        var urlF = 'https://view.officeapps.live.com/op/view.aspx?src='
        var src = urlF + process.env.REACT_APP_URL_API+'/rest/surat/'+paramValue+'.docx&embedded=true';
        var html = '<body><script>window.top.location="'+src+'";</script></body>';
        document.getElementById("viewer").src = 'data:text/html;charset=utf-8,' + encodeURI(html);
        //document.getElementById("viewer").src = src;
    }

  render() {
    return (
      <div>
        <Row
            style={{
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Col 
            style={{
                height: '100vh',
                //justifyContent: 'center',
                //alignItems: 'center',
            }}
            >
                <iframe
                    sandbox="allow-scripts allow-top-navigation"
                    title="view"
                    id="viewer"
                    width="100%" height="100%"
                />
            </Col>
            
        </Row>
      </div>
    );
  }
}

export default viewsurat;
