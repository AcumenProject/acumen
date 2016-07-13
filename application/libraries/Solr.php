<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require_once(APPPATH . 'third_party/SolrPhpClient/Apache/Solr/Service.php');

class Solr extends Apache_Solr_Service {
	
	public $num_found = 0;
	public $default_thumb = array();
	
	protected $CI;
	protected $connected = false;
	protected $hostname;
	protected $port;
	protected $path;
	
	public function __construct(){
		$this->CI =& get_instance();

		/*Load Solr config file*/
		$this->CI->load->config('solr');
		$this->hostname = $this->CI->config->item('solr_hostname');
		$this->port = $this->CI->config->item('solr_port');
		$this->path = $this->CI->config->item('solr_path');
	}
	
	public function connect(){
		if (!$this->connected){
			parent::__construct($this->hostname, $this->port, $this->path);
			
			/* Test connection */
			if ($this->ping() !== false){
				$this->connected = true;
			}
		}
	}
	
	public function search($query, $offset = 0, $limit = 10, $params = array()){
		if (!$this->connected){
			$this->connect();
		}
		if ($this->connected){
			return parent::search($query, $offset, $limit, $params);
		}
	}
	
	
}