<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

Class Searcher{
	
	public $q;
	public $start = 0;
	public $limit = 20;
    public $page = 1;
	public $params = array();
	public $solr_params = array();
	public $default_thumbnail = array();
	
	public $CI;
	
	public function __construct(){
		$this->CI =& get_instance();
		
		$this->CI->config->load('acumen');
		$this->default_thumbnail = $this->CI->config->item('default_thumbnail');
	}

    public function _process_params($params){
        if (!empty($params['limit'])){
            $this->limit = (int)$params['limit'];
        }
        if (!empty($params['page'])){
            $this->_set_start_from_page($params['page']);
        }
        else{
            $this->_set_start_from_page($this->page);
        }
        /*foreach (get_object_vars($this) as $e){
            if (isset($params[$e])){
                if (method_exists($this, '_process_param'.$e)){
                    call_user_func(array($this, '_process_param'.$e));
                }
                else if (property_exists($this, $e)){
                    $this->{$e} = $params[$e];
                }
            }
        }
        var_dump(get_object_vars($this));*/
    }

    protected function _set_start_from_page($page){
        if (is_numeric($page)){
            $this->page = $page;
            $this->start = ($page-1) * $this->limit;
        }
    }
	
	protected function _find_thumb($file_id){
		$this->CI->load->database();
		$q = $this->CI->db->query("SELECT name, thumb_path FROM asset WHERE file_id = ".$file_id." ORDER BY name LIMIT 1");
		if ($q->num_rows() == 0){
			$q2 = $this->CI->db->query("SELECT id FROM file WHERE parent_id = ".$file_id." ORDER BY file_name LIMIT 1");
			if ($child = $q2->result_array()){
				return $this->_find_thumb($child[0]['id']);
			}
		}
		else{
			$thumb = $q->result_array();
			$path = $thumb[0]['thumb_path'].$thumb[0]['name'].'_128.jpg';
			if ($this->_thumb_exists($path)){
				return $path;
			}
		}
		return false;
	}

    protected function _find_thumb_solr($repo_loc){
        $this->CI->load->library('solr');
        $q = 'repo_loc:' . $repo_loc . '*';
        $params = array(
            'sort' => 'file_name asc',
            'fl' => 'thumb_path asset_type repo_loc',
            'fq' => 'thumb_path:*'
        );
        $r = $this->CI->solr->search($q, 0, 1, $params)->response;
        if ($r->numFound > 0){
            return $this->_get_thumb($r->docs[0]->asset_type, $r->docs[0]->repo_loc, $r->docs[0]->thumb_path);
        }
        return 'nope';
    }
	
	protected function _get_thumb($type = 'default', $file_name = '', $thumb_path = ''){
		switch( $type ){
			case 'image':
				$thumb_url = "{$thumb_path}{$file_name}_128.jpg";
				break;
			case 'video':
			case 'audio':
			case 'document':
				$thumb_url = $this->default_thumbnail[$type];
				break;
            case 'sound recording-musical':
            case 'sound recording-nonmusical':
            case 'Sound; Text':
            case 'Sound':
            case 'Audio':
                $thumb_url = $this->default_thumbnail['audio'];
                break;
			default:
				$thumb_url = $this->default_thumbnail['Archived Collection'];
		}
		return $thumb_url;
	}
	
	protected function _thumb_exists($path){
		$pattren = '/'.preg_quote($this->CI->config->item('acumen_url'), '/').'/';
		$path = preg_replace($pattren, $this->CI->config->item('acumen_base_path'), $path);

		if (file_exists($path)){
			return true;
		}
		else{
			return false;
		}
	
	}
	
	protected function _get_count_where($from, $where, $what = 'id'){
		//$this->CI->load->database();
		$this->CI->db->select("count($what) as c");
		$this->CI->db->from($from);
		$this->CI->db->where($where);
		return $this->CI->db->get()->row()->c;
	}
}