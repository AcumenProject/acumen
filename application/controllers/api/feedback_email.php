<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Feedback_email extends CI_Controller {

    protected $to = "libwebhelp@ua.edu";
    protected $message = "@category=Web Services::Acumen\n@owner=willjones\n\n";

    public function __construct(){
        parent::__construct();
    }

    public function index(){
        $params = $this->uri->ruri_to_assoc();
        if (!empty($params['email']) && !isset($params['confirm_email'])){
            $this->load->library('email');
            array_walk($params, array($this, 'decodeParams'));

            $this->email->to($this->to);
            $this->email->from($params['email'], $params['name']);

            $this->email->subject('Acumen - ' . $params['category']);
            $this->email->message($this->message . $params['details']);

            $this->email->send();
            $this->email->print_debugger();
        }
    }

    protected function decodeParams(&$param, $key){
        $param = urldecode($param);
    }

}