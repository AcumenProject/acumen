<?php defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'/libraries/REST_Controller.php';

class Transcripts extends REST_Controller {

    public function __construct(){
        parent::__construct();

        $this->load->library('transcribe');
    }

    public function index_get(){
        if (!$this->get('item')){
            $this->response(NULL, 400);
        }

        $transcript = $this->transcribe->getTranscriptByAsset($this->get('item'));
        if ($transcript){
            $this->response($transcript, 200);
        }
        else{
            $this->reposonse(array('info' => 'There are currently no tags for this item. Add some!'), 404);
        }
    }

    public function index_post(){
        if ($this->post('email')){
            $this->response(NULL, 400);
        }

        $this->transcribe->addTranscript($this->post('transcript'), $this->get('item'));
        $this->response(array('message' => 'Transcript added!', 200));
    }

    public function index_delete(){
        $this->response(array('warning' => 'Feature not yet implemented'));
    }
}