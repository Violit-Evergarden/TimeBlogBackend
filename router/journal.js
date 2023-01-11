const express=require('express')
const router=express.Router()

const router_handler=require('../router_handler/journal')

router.get('/getjournal',router_handler.getJournal)
router.post('/subjournal',router_handler.subJournal)

module.exports= router