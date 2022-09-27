function timestampToDate(unix_timestamp){
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const date_ = unix_timestamp ? new Date(unix_timestamp * 1000): new Date();
  
  const year = date_.getFullYear();
  const month = months[date_.getMonth()];
  const date = date_.getDate();
  const hours = date_.getHours();
  const minutes = "0" + date_.getMinutes();
  const seconds = "0" + date_.getSeconds();
  const time = date + ' ' + month + ' ' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  return time;
}

module.exports = { timestampToDate }
