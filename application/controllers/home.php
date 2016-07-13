<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Home extends CI_Controller {
	
	protected $tpl_vars = array();
    protected $search = array();
	
	public function __construct(){
		parent::__construct();
        $this->tpl_vars['shared_js_vars']['ENV_PATH'] = ENV_PATH;
        $this->tpl_vars['shared_js_vars']['NG_PATH'] = NG_PATH;
	}
	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/home
	 *	- or -  
	 * 		http://example.com/index.php/home/index
	 *	- or -
	 * Since this controller is set as the default controller in 
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see http://codeigniter.com/user_guide/general/urls.html
	 */
	public function index()
	{		
		$this->load->view('index_template', $this->tpl_vars);
	}
}

/* End of file home.php */
/* Location: ./application/controllers/home.php */