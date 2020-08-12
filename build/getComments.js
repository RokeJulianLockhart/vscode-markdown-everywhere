// node ./build/getComments
// a single-shot script, generate comments.js
const p3 = "C:/Users/ZhaoUV/AppData/Local/Programs/Microsoft VS Code/resources/app/extensions/"
const fs = require('fs')

let arr=fs.readdirSync(p3).map(p=>{
    const rootDir = p3+p+'/'
    const packageJSONPath = rootDir+'package.json';
    let output=[]
    if (!fs.existsSync(packageJSONPath)) {
        return output
    }
    const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath,{encoding:'utf-8'}))
    // return packageJSON
    const po=packageJSON
    if (!(po.contributes && po.contributes.languages && po.contributes.grammars)) {
        return output
    }
    let languages={}
    po.contributes.grammars.forEach(l => {
        if (!(l.language && l.scopeName)) {
            return
        }
        languages[l.language]=l.scopeName
    })
    po.contributes.languages.forEach(l => {
        if (!(l.id && l.configuration && languages[l.id])) {
            return
        }
        const configuration = eval('('+fs.readFileSync(rootDir+l.configuration,{encoding:'utf-8'})+')')
        output.push({id:l.id,comments:configuration.comments,scopeName:languages[l.id]})
    });
    return output
}).reduce((a,b)=>a.concat(b))

// console.log(arr);
// fs.writeFileSync('ignore/packages.json',JSON.stringify(arr,null,4))
fs.writeFileSync('build/comments.json',JSON.stringify(arr,null,4))