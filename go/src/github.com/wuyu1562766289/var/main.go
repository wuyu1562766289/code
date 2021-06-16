package main

import "fmt"

// 声明变量
// var name string
// var age int
// var isOk bool

// 批量声明
var (
	name string // ""
	age  int    // 0
	isOk bool   // false
)

func main() {
	name = "wangxing"
	age = 18
	isOk = true
	// Go语言中非全局变量声明必须使用，不使用编译不过去
	fmt.Print(isOk)             //在终端总输出要打印的内容
	fmt.Println()               // 打印一个空行
	fmt.Printf("name:%s", name) // %s:占位符 使用name这个变量的值区替换占位符
	fmt.Println(age)            // 打印完指定的内容后会在后面加一个换行符

	// 声明变量同时赋值
	var w string = "ww"
	fmt.Println(w)

	// 类型推导
	var x = 20
	fmt.Println(x)

	// 简短变量声明，只能在函数里面使用
	a := "wx"
	fmt.Println(a)

	// 匿名变量是一个特殊的变量：_
}
