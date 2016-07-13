<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Html_snapshot extends CI_Controller {
    public function __construct(){
        parent::__construct();
    }

    public function index($repo_id = ''){
        $req = $this->input->get();
        $repo_id = !empty($req['_escaped_fragment_']) ? $req['_escaped_fragment_'] : $repo_id;
//        if (!empty($req['crawl'])){
            $this->load->model('Metadata_model', 'metadata');
            $this->load->library('tagger');
            $this->load->library('transcribe');
            $this->load->model('Item_model');

            $html = array();
            $escape_fragment = ltrim($repo_id, '/');
            $params = explode("/", $escape_fragment);
            $repoId = $params[0];

            $this->metadata->get($repoId);
            if (isset($this->metadata->file)){
                //log_message('debug', var_dump($this->metadata));
                $html['title'] = isset($this->metadata->file['title']) ? $this->metadata->file['title'] : $repoId;
                if (isset($this->metadata->metadata)){
                    $html['body']['metadata'] = $this->metadata->metadata;
                }
            }

            $this->Item_model->get($repo_id);
        if (isset($this->Item_model->type)){
            $asset = array(
                'asset_path' => $this->Item_model->asset_path,
                'type' => $this->Item_model->type,
                'size' => $this->Item_model->size,
                'last_modified' => $this->Item_model->last_modified
            );
            $html['body']['asset'] = $asset;
        }

            if (count($params) > 1){
                $repoId = strpos($params[2], '?') ? strstr($params[2], '?', TRUE) : $params[2];
            }

            $tags = $this->tagger->getTagsByAsset($repoId);
            if (!empty($tags)){
                $html['body']['tags'] = $tags;
            }

            $transcripts = $this->transcribe->getTranscriptsByAsset($repoId);
            if (!empty($transcripts)){
                $html['body']['transcripts'] = $transcripts;
            }



            $this->load->view('html_snapshot', $html);
//        }
    }
}