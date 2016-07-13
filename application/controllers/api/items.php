<?php defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'/libraries/REST_Controller.php';

class Items extends REST_Controller {

    /**
     * Expected Response Format:
     *  {
     *      'data': [], //Array of data being retrieved
     *      'metadata': [{}] //optional -- Any metadata that may apply to response data
     *      'msg': [ // Messages relative to response
     *          {
     *              'error': ERROR_MESSAGE,
     *              'success': SUCCESS_MESSAGE,
     *              'warning': WARNING_MESSAGE,
     *              'info': INFO_MESSAGE
     *          }
     *      ]
     *  }
     *
     * For "self linking" and object for the REST API,
     * use this format where the object it defined:
     * {
     *  ...Object Definition...
     *  self:{
     *      link: 'URL_THAT_LINKS_TO_SELF'
     *  }
     */

    public function index_get(){
        if (!$this->get('item')){
            $this->response = NULL;
        }

        if (count($this->get()) > 1 && (!$this->get('page') && !$this->get('limit'))){
            $this->_delegate('get');
        }
        else{

            $this->load->library('items_searcher');

            if ($this->items_searcher->init($this->get())){
                $this->items_searcher->get_list();
                $r = array(
                    'data' => $this->items_searcher->list,
                    'metadata' => array(
                        'repo_loc' => $this->items_searcher->repo_loc,
                        'title' => $this->items_searcher->title,
                        'file_path' => $this->items_searcher->file_path,
                        'limit' => $this->items_searcher->limit,
                        'page' => $this->items_searcher->page,
                        'totals' => $this->items_searcher->totals,
                        'total' => ($this->items_searcher->asset_total + $this->items_searcher->metadata_total)
                    ),
                    'self' => array(
                        'link' => $this->config->base_url() . 'api/items/' . $this->items_searcher->repo_loc
                    )
                );
                $this->response($r, 200);
            }
            $msg = $this->message('error', 'No digitized items available');
            $this->response($msg, 404);
        }
    }

    public function index_post(){
        if (!$this->get('item')){
            $this->response(NULL, 400);
        }

        if (count($this->post()) > 1){
            $this->_delegate('post');
        }
        else{
            $msg = $this->message('warning', 'Feature not yet implemented' . (print_r($this->post())));
            $this->response($msg, 501);
        }
    }

    public function index_put(){
        if (!$this->put('item')){
            $this->response(NULL, 400);
        }

        if (count($this->put()) > 1){
            $this->_delegate('put');
        }
        else{
            $msg = $this->message('warning', 'Feature not yet implemented');
            $this->response($msg, 501);
        }
    }

    public function index_delete(){
        if (!$this->delete('item')){
            $this->response(NULL, 400);
        }

        if (count($this->delete()) > 1){
            $this->_delegate('delete');
        }
        else{
            $msg = $this->message('warning', 'Feature not yet implemented');
            $this->response($msg, 501);
        }
    }

    protected function _delegate($request_type){
        foreach ($this->{$request_type}() as $param => $val){
            $method = $param.'_'.$request_type;
            if (method_exists($this, $method) && $param !== 'index'){
                $this->$method();
            }
        }
    }

    /**
     * Item Detail REST services - includes tags, transcripts, and metadata for the item
     */
    public function details_get(){
        //log_message('debug', print_r($this->get()));
        $this->load->model('Item_model');

        $this->load->library('tagger');
        $this->load->library('transcribe');

        $result = array();
        $this->Item_model->get($this->get('item'));

        if (isset($this->Item_model->type)){
            if (!empty($this->Item_model->metadata)){
                $this->load->library('metadata');
                $result['metadata'] = (array) $this->Item_model->metadata;
                $result['metadata'] = array_merge($result['metadata'], $this->metadata->getByType($this->Item_model->metadata->file_path, $this->Item_model->metadata->type));
//                $result['metadata']['value'] = $this->metadata->getByType($this->Item_model->metadata->file_path, $this->Item_model->metadata->type);
            }
            $metadata = array(
                'asset_path' => $this->Item_model->asset_path,
                'type' => $this->Item_model->type,
                'size' => $this->Item_model->size,
                'last_modified' => $this->Item_model->last_modified,
                'has_children' => $this->Item_model->has_children
            );

            $tags = $this->tagger->getTagsByAsset($this->get('item'));
            $transcripts = $this->transcribe->getTranscriptsByAsset($this->get('item'));
            if (!empty($tags)){
                $result['tags'] = $tags;
            }
            if (!empty($transcripts)){
                $result['transcripts'] = $transcripts;
            }
            $this->response(array('data' => array($result), 'metadata' => $metadata), 200);
        }

        $msg = $this->message('warning', 'No item at '.$this->get('item').' currently exists');
        $this->response($msg, 300);
    }

    /**
     * Items Metadata REST services
     */
    public function metadata_get(){
        if (!$this->get('item')){
            $this->response(NULL, 400);
        }
        $get_rank = true;

        $this->load->model('Metadata_model', 'metadata');
        $this->metadata->get($this->get('item'), $get_rank);
        if (isset($this->metadata->file) && !empty($this->metadata->file)){

            $response = array(
                'data' => array($this->metadata->metadata),
                'metadata' => $this->metadata->file
            );
            $this->response($response, 200);
        }



        $this->load->library('items_searcher');

        if ($found = $this->items_searcher->find_lost($this->get('item'))){

            $msg = $this->message(Array(
                'warning' => 'This page might have moved.',
                'found' => $found
            ));
            $this->response($msg, 301);
        }

        $msg = $this->message(Array(
            'error' => 'Page not found.'
        ));

        $this->response($msg, 404);
    }

    /**
     * Items Tags REST services
     */
    public function tags_get(){
        if (!$this->get('item')){
            $this->response(NULL, 400);
        }
        $this->load->library('tagger');

        $tags = $this->tagger->getTagsByAsset($this->get('item'));
        if (!empty($tags)){
            $this->response(array('data' => $tags), 200);
        }

        $msg = $this->message('info', 'There are currently no tags for this item. Add some!');
        $this->response($msg, 404);
    }

    public function tags_post(){
        $this->response(NULL, 400);
        log_message('debug', '__TAGS__:: '.serialize($this->post()).' -- GET -- '.serialize($this->get()));

        if ($this->post('email')){
            $this->response(NULL, 400);
        }
        $this->load->library('tagger');

        $this->tagger->addTags($this->post('tags'), $this->get('item'));
        $msg = $this->message('message', 'Tags added!'.serialize($this->post('tags')).' -- GET -- '.serialize($this->get('item')));
        $this->response($msg, 201);
    }

    public function tags_put(){
        //$this->load->library('tagger');
        $msg = $this->message('warning', 'Feature not yet implemented');
        $this->response($msg, 501);
    }

    public function tags_delete(){
        //$this->load->library('tagger');
        $msg = $this->message('warning', 'Feature not yet implemented');
        $this->response($msg, 501);
    }

    /**
     * transcripts REST services
     */
    public function transcripts_get(){
        if (!$this->get('item')){
            $this->response(NULL, 400);
        }
        $this->load->library('transcribe');

        $transcripts = $this->transcribe->getTranscriptsByAsset($this->get('item'));
        if (!empty($transcripts)){
            $this->response(array('data' => $transcripts), 200);
        }

        $msg = $this->message('info', 'Write a transcripts for this item!');
        $this->response($msg, 404);
    }

    public function transcripts_post(){
        if (!$this->post('transcripts') || !$this->post('item') || $this->post('honey')){
            $this->response(NULL, 400);
        }
        $this->load->library('transcribe');

        $this->transcribe->addtranscripts($this->post('transcripts'), $this->post('item'));
        $msg = $this->message('message', 'transcripts added!');
        $this->response($msg, 200);
    }

    public function transcripts_put(){
        //$this->load->library('transcribe');
        $msg = $this->message('warning', 'Feature not yet implemented');
        $this->response($msg, 501);
    }

    public function transcripts_delete(){
        //$this->load->library('transcribe');
        $msg = $this->message('warning', 'Feature not yet implemented');
        $this->response($msg, 501);
    }

    public function exists_get(){
        $this->load->database();
        /*$q = "SELECT id as metadata_id, (SELECT id FROM asset WHERE name=?) as asset_id".
            " FROM file".
                " WHERE file_name LIKE ? AND status_type_id=1;";*/
        $q = "SELECT".
                " (SELECT id FROM asset WHERE name = ? AND status_type_id=1) as asset_id,".
                " (SELECT id FROM file WHERE file_name LIKE ? AND status_type_id=1) as metadata_id,".
                " (SELECT at.type FROM asset_type at LEFT JOIN asset a ON a.asset_type_id = at.id WHERE a.id = asset_id) as asset_type";
        $query = $this->db->query($q, array($this->get('item'), $this->get('item').'.%'));
        if ($result = $query->result_array()){
            if ($result[0]['asset_id'] || $result[0]['metadata_id']){
            $result[0]['repo_loc'] = $this->get('item');
            $this->response(array('data' => $result), 200);
        }
        }
        $msg = $this->message('warning', 'It appears this item has moved or does not exist');
        $this->response($msg, 404);
    }

    // Helper to wrap the response message in the proper array structure
    private function message($type, $msg = null){
        $output = Array();
        if (is_array($type)){
            foreach ($type as $t => $m){
                $output[$t] = $m;
            }
        }
        else{
            $output[$type] = $msg;
        }
        return array('msg' => $output);
    }
}