package server

import (
	"models"
	"sync"	
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"net/http"
)

type Channels struct {
	channels map[string] chan any	
	myMutex sync.Mutex
}

func (c *Channels) Set(key_name string,target_chan chan any){
	c.myMutex.Lock()
	defer c.myMutex.Unlock()

	c.channels[key_name] = target_chan
}

func (c *Channels) Get(key_name string) chan any {
	c.myMutex.Lock()
	defer c.myMutex.Unlock()
	return c.channels[key_name]
}

func NewChannels() *Channels {
    p := &Channels{
		channels: make(map[string]chan any)
	}
	return p
}

func CreateChannels(){
	chan_map := NewChannels()

}

func NewServer() *echo.Echo {
	e := &echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/islogin", func(c echo.Context) error {
		cokie,err := c.Cookie("auth_password")

		return c.JSONResponse({state:fasle})
	})
	
	e.GET("/importCsv",func(c echo.Content) error {

	})
	
	return e
}


func main(){
	mainServer := NewServer()
	
	mainServer.GET("")


}