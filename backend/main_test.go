package main

import (
	"fmt"
	"runtime"
	"testing"
)

func TestMain(t *testing.T) {
	fmt.Println("Hello, World!")
	for true {
		runtime.Gosched()
		fmt.Println("Hello, World!")
	}
}
