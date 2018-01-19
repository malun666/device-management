package cn.edu.bupt.controller;

import cn.edu.bupt.utils.HttpUtil;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jdk.nashorn.internal.parser.JSONParser;
import org.springframework.web.bind.annotation.*;

/**
 * Created by Administrator on 2018/1/18.
 */

@RestController
@RequestMapping("/api/plugin")
public class PluginController extends DefaultThingsboardAwaredController{
    @RequestMapping(value = "/allPlugins",method = RequestMethod.GET, produces = {"application/json;charset=UTF-8"})
    public String getAllPlugins(){
        String requestAddr = "/api/plugins";

        String responseContent = null;
        try{
            responseContent = HttpUtil.sendGetToThingsboard("http://" + getServer() + requestAddr,
                    null,
                    request.getSession());

        }catch(Exception e){
            return retFail(e.toString()) ;
        }
        return retSuccess(responseContent);
    }

    @RequestMapping(value = "/savePlugin",method = RequestMethod.POST, produces = {"application/json;charset=UTF-8"})
    public String savePlugin(@RequestBody String json){
        String requestAddr = "/api/plugin";
        String responseContent = null;
        try{
            responseContent = HttpUtil.sendPostToThingsboard("http://" + getServer() + requestAddr,
                    null,new JsonParser().parse(json).getAsJsonObject(),
                    request.getSession());

        }catch(Exception e){
            return retFail(e.toString()) ;
        }
        return retSuccess(responseContent);
    }

    @RequestMapping(value = "/deletePlugin/{pluginId}",method = RequestMethod.DELETE, produces = {"application/json;charset=UTF-8"})
    public String deletePlugin(@PathVariable String pluginId){
        String requestAddr = "/api/plugin/"+pluginId;
        String responseContent = null;
        try{
            responseContent = HttpUtil.sendDeletToThingsboard("http://" + getServer() + requestAddr,
                    request.getSession());
        }catch(Exception e){
            return retFail(e.toString()) ;
        }
        return retSuccess(responseContent);
    }

    @RequestMapping(value = "/{pluginId}/suspend",method = RequestMethod.POST, produces = {"application/json;charset=UTF-8"})
    public String suspend(@PathVariable String pluginId){
        String requestAddr = "/api/plugin/"+pluginId+"/suspend";

        String responseContent = null;
        try{
            responseContent = HttpUtil.sendPostToThingsboard("http://" + getServer() + requestAddr,
                    null,null,
                    request.getSession());

        }catch(Exception e){
            return retFail(e.toString()) ;
        }
        return retSuccess(responseContent);
    }

    @RequestMapping(value = "/{pluginId}/activate",method = RequestMethod.POST, produces = {"application/json;charset=UTF-8"})
    public String activate(@PathVariable String pluginId){
        String requestAddr = "/api/plugin/"+pluginId+"/activate";

        String responseContent = null;
        try{
            responseContent = HttpUtil.sendPostToThingsboard("http://" + getServer() + requestAddr,
                    null,null,
                    request.getSession());

        }catch(Exception e){
            return retFail(e.toString()) ;
        }
        return retSuccess(responseContent);
    }
}