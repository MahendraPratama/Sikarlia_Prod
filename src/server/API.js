export const pushKontrak=(dataKontrak)=>{
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataKontrak)
    };
    fetch(process.env.REACT_APP_URL_API+'/rest/insertKontrak.php', requestOptions)
        .then(response => response.json())
        .then(respon => ()=>{
        const dataAPI = respon;
        if(dataAPI.response_code != 200){
            return {respon: false,message: dataAPI.message};
        }else{
            return {respon: true,message: dataAPI.message};
            //window.location.href = "/kontraksaya"
        }
    });
  
}