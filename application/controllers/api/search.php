<?php defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'/libraries/REST_Controller.php';

class Search extends REST_Controller {
    public function index_get(){
        if (!$this->get('q')){
            $this->response(NULL, 400);
        }
        $this->load->library('solr_searcher');
        // Pass the uri params array to the search to be processes and searched
        $result = $this->solr_searcher->search($this->get());
        $r = array(
            'data' => isset($result['docs']) ? $result['docs'] : array(),
            'metadata' => array(
                'numFound' => $result['numFound'],
                'queryTime' => $result['queryTime']
            )
        );
        $this->response($r, 200);
    }
}