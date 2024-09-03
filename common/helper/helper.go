package helper

import (
	"encoding/json"
	"net/http"
)

type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func CommonResult(w http.ResponseWriter, code int, msg string, data interface{}) error {
	res := Response{
		Code:    code,
		Message: msg,
		Data:    data,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	err := json.NewEncoder(w).Encode(res)
	if err != nil {
		return err
	}
	return nil
}

func SuccessResult(w http.ResponseWriter, data interface{}) error {
	return CommonResult(w, http.StatusOK, "success", data)
}

func ErrorResult(w http.ResponseWriter, code int, msg string) error {
	return CommonResult(w, code, msg, nil)
}

func UnauthorizedResult(w http.ResponseWriter) error {
	return ErrorResult(w, http.StatusUnauthorized, "unauthorized")
}