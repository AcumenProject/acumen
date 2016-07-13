<?php defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'/libraries/REST_Controller.php';

class Tags extends REST_Controller {

    public function __construct(){
        parent::__construct();

        $this->load->library('tagger');
    }

    public function index_get(){
        if (!$this->get('item')){
            $this->response(NULL, 400);
        }

        $tags = $this->tagger->getTagsByAsset($this->get('item'));
        if ($tags){
            $this->response($tags, 200);
        }
        else{
            $this->reposonse(array('info' => 'There are currently no tags for this item. Add some!'), 404);
        }
    }

    public function index_post(){
        if ($this->get('email')){
            $this->response(NULL, 400);
        }
        log_message('debug', 'ITEM::: '.serialize($this->get()));
        log_message('debug', 'tags::: '.serialize($this->post()));
        if ($this->tagger->addTags($this->post('tags'), $this->get('item'))){
            $this->response(array('message' => 'Tags added!', 200));
        }
    }

    public function index_delete(){
        $this->response(array('warning' => 'Feature not yet implemented'));
    }
}