const router = require('koa-router')()
// const userCtl = require("../controller/user")
const multer = require("koa-multer")
const fs = require("fs")
const path = require("path")
router.prefix("/upload")


const storage = multer.diskStorage({
    // 设置文件的存储位置
    destination: function (req, file, cb) {
        // 按照不同的天存储文件
        let date = new Date()
        let year = date.getFullYear()
        let mouth = date.getMonth() + 1
        let day = date.getDate()
        let dir = "./public/uploads/"+year+mouth+day
        // 判断目录是否存在  不存在则创建目录
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {
                recursive: true
            })
        }
        // 然后将文件上传到目录
        cb(null, dir)
    },
    // 文件存储名称
    filename: function (req, file, cb) {
        console.log(file)
        let fileName = file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        cb(null, fileName)
    }

});

const upload = multer({ storage });

// 上传图片的接口
router.post("/img", upload.single('myfile'), async ctx => {
    let path=ctx.req.file.path
    path=ctx.origin+""+path.replace("public","")
    ctx.body = {
        data: path
    }
})


// 富文本编辑器上传图片
router.post("/editor/img",upload.single("editorFile"),async ctx=>{
    let path=ctx.req.file.path
    path=ctx.origin+""+path.replace("public","")
    ctx.body={
        errno:0,
        data:[
            {
                url:path,
                alt:'',
                href:""
            }
        ]
    }
})


module.exports = router