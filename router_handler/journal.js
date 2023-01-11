const db=require('../db/index')


exports.getJournal=(req,res)=>{
  const sql='select journals from web_users where id=?'
  db.query(sql,req.query.id,(err,result)=>{
    if(err) return res.cc(err)
    if(result.length==0) return res.cc('获取日志数据失败')
    res.send({
      status:0,
      data:result[0].journals
    })
  })
}
exports.subJournal=(req,res)=>{
  const getSql=`select journals from web_users where id=?`
  db.query(getSql,req.body.id,(err,result)=>{
    if(err) return res.cc(err)
    if(result.length==0) return res.cc('获取日志数据失败')
    let journals=JSON.parse(result[0].journals || '[]')
    let newJournal=JSON.parse(req.body.journals)
    let endJournal=JSON.stringify(journals.unshift(newJournal))
    console.log(endJournal)
    const sql=`update web_users set journals=? where id=?`
    db.query(sql,[endJournal,req.body.id],(err,result)=>{
      if(err) return res.cc(err)
      if(result.affectedRows!==1) return res.cc('跟新日志失败',2)
      res.send({
        status:0,
        message:'日志更新成功'
      })
    })
  })
}