// 原型式继承：创建超类型（父对象）原型对象的副本，并返回一个实例化对象
function clonePrototype(superType) {
    function F() {}
    F.prototype = superType.prototype;
    return new F();
}

// 寄生式继承：将原型式继承返回的实例化对象指定给子类型的原型对象
function inheritPrototype(superType, subType) {
    // var f = clonePrototype(superType);   //兼容低版本写法
    var f = Object.create(superType.prototype);    //现代写法
    f.constructor = subType;
    subType.prototype = f;
}

// 超类型的构造函数（首字母大写是为了区分构造函数和普通函数），用来定义实例属性
function SuperType(name) {
    this.name = name;
    this.color = ["red", "blue", "green"];
}

// 超类型的原型模式，用来定义实例共享的部分：实例的方法和某些公共属性
SuperType.prototype = {
    constructor : SuperType,
    sayName : function () {
        console.log(this.name);
    }
}

// 子类型的构造函数
function SubType(name, age) {
    // 继承超类型构造函数中的属性
    SuperType.call(this, name);

    this.age = age;
}

// 继承超类型原型中的属性和方法
inheritPrototype(SuperType, SubType);

// 注意子类型的原型必须得写在inheritPrototype(SuperType, SubType)后面，即继承了超类型的原型后再添加自己的，因为在继承超类型的原型时会对子类型的原型整个重写，即第12行，如果先前有写过原型就会覆盖先前写的，再就是写在后面时不能使用对象字面量，得一个个单独写，理由同上，整个写会覆盖先前写的
SubType.prototype.sayAge = function () {
    console.log(this.age);
}

var test = new SubType("dzh", 18);
console.log(test);
test.sayName();
test.sayAge();