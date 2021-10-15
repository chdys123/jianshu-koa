let a = function () {
    this.name = 'ch'
}
a.prototype.sex = "男"

let b = new a()
// console.log(b.name)
b.age = "13"
for (let i in b) {
    // if (b.hasOwnProperty(i)) {
    //     console.log(b[i])
    // }
    // console.log(i)

    if(i in b){
        console.log(i)
    }
}

// for let i in obj 遍历可枚举的属性
// obj.hasOwnProperty(proper) 返回布尔值 是自身属性则返回 true 原型链上属性为false 继承得到的属性也是自身属性
// hasOwnProperty 不是关键字 当对象里面有这个同名方法的时候 可能会得不到想要的结果  于是可以用({}).hasOwnProperty.call(obj,proper)  但是这种会创建一个新对象  可以用Object.prototype.hasOwnProperty.call(obj,proper)

// in 操作符 判断对象是否有该属性 不会忽略原型上面的属性


// 深拷贝 是重新开辟一块堆内存 存放对象

// 浅拷贝 里面的基本类型是直接赋值了，但是应用类型还是公用一块堆内存


// 赋值基本类型的话 不影响  应用类型的话 还是公用一块堆内存。


// 实现深拷贝


function deepClone(obj){
    let cloneObj=new obj.constructor
    if(obj===null) return obj
    if(obj instanceof Date) return new Date(obj)
    if(obj instanceof RegExp) return new RegExp(obj)
    if(typeof obj !== 'object') return obj
    for(let i in obj){
        if(obj.hasOwnProperty(i)){
            cloneObj[i]=deepClone(obj[i])
        }
    }
    return cloneObj    
}



let obj1={
    a:'ch',
    b:[1,2],
    c:new Date(),
    d:new RegExp('abc')
}

let obj2=deepClone(obj1)
obj2.a="wly"
obj2.b[0]=7
console.log(obj1)
console.log(obj2)


// 浅拷贝实现方式
// Object.assign() 合并多个JavaScript对象（第一个参数是目标对象，后面的都是源对象，assign方法将多个原对象的属性和方法都合并到了目标对象上面，如果在这个过程中出现同名的属性（方法），后合并的属性（方法）会覆盖之前的同名属性（方法）。）
// ...
// concat
// lodash.js clone

// 深拷贝实现方式
// $.extend jquery中方式
// deepClone



// console.log(b.constructor)
// console.log(b.__proto__.constructor)
// console.log(({}).constructor)