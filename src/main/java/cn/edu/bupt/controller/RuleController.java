package cn.edu.bupt.controller;

import cn.edu.bupt.utils.HttpUtil;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;

/**
 * Created by Administrator on 2018/1/10.
 *
 * 规则接口
 */
@RestController
@RequestMapping("/api/rule")
public class RuleController extends DefaultThingsboardAwaredController{
    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    @RequestMapping(value = "/allRules",method = RequestMethod.GET, produces = {"application/json;charset=UTF-8"})
    @ResponseBody
    private String getRules()
    {
        String requestAddr = "/api/rule/rules";

        String responseContent = null;
        try{
            responseContent = HttpUtil.sendGetToThingsboard("http://" + getSmartRulerServer() + requestAddr,
                    null,
                    request.getSession());

        }catch(Exception e){
            return retFail(e.toString()) ;
        }

        JsonArray array = new JsonParser().parse(responseContent).getAsJsonArray();
        return retSuccess(array.toString());
    }

    @RequestMapping(value = "/{ruleId}",method = RequestMethod.GET, produces = {"application/json;charset=UTF-8"})
    @ResponseBody
    private String getARules(@PathVariable("ruleId") String ruleId)
    {
        String requestAddr = "/api/rule/rule/"+ruleId;

        String responseContent = null;
        try{
            responseContent = HttpUtil.sendGetToThingsboard("http://" + getSmartRulerServer() + requestAddr,
                    null,
                    request.getSession());

        }catch(Exception e){
            return retFail(e.toString()) ;
        }

        return retSuccess(responseContent);
    }

    @RequestMapping(value = "/ruleByTenant/{tenantId}",method = RequestMethod.GET, produces = {"application/json;charset=UTF-8"})
    @ResponseBody
    private String getRulesByTenantId(@PathVariable("tenantId") String tenantId)
    {
        String requestAddr = "/api/rule/ruleByTenant/"+tenantId;

        String responseContent = null;
        try{
            responseContent = HttpUtil.sendGetToThingsboard("http://" + getSmartRulerServer() + requestAddr,
                    null,
                    request.getSession());

        }catch(Exception e){
            return retFail(e.toString()) ;
        }

        JsonArray array = new JsonParser().parse(responseContent).getAsJsonArray();
        return retSuccess(array.toString());
    }

    @RequestMapping(value = "/allFilters",method = RequestMethod.GET, produces = {"application/json;charset=UTF-8"})
    @ResponseBody
    public String getFilters()
    {
        String requestAddr = "/api/filter/filters";

        String responseContent = null;
        try{
            responseContent=HttpUtil.sendGetToThingsboard("http://" + getSmartRulerServer() + requestAddr,
                    null,
                    request.getSession());
        }catch(Exception e){
            return retFail(e.toString());
        }
        return retSuccess(responseContent);
    }

    @RequestMapping(value = "/allPlugins",method = RequestMethod.GET, produces = {"application/json;charset=UTF-8"})
    @ResponseBody
    public String getPlugins()
    {
        String requestAddr = "/api/plugin/all";

        String responseContent = null;
        try{
            responseContent=HttpUtil.sendGetToThingsboard("http://" + getSmartRulerServer() + requestAddr,
                    null,
                    request.getSession());
        }catch (Exception e){
            return retFail(e.toString());
        }
        return retSuccess(responseContent);
    }
    //无需再捕获插件动作
/**
    @RequestMapping(value = "/allPluginsSchema",method = RequestMethod.GET, produces = {"application/json;charset=UTF-8"})
    @ResponseBody
    public String getPluginsSchema()
    {
        String requestAddr = "/api/components/PLUGIN";

        String responseContent = null;
        try{
            responseContent=HttpUtil.sendGetToThingsboard("http://" + getServer() + requestAddr,
                    null,
                    request.getSession());
        }catch (Exception e){
            return retFail(e.toString());
        }

        return retSuccess(responseContent);
    }

    @RequestMapping(value = "/getPlugin/{className}/{pluginName}",method = RequestMethod.GET,produces = {"application/json;charset=UTF-8"})
    @ResponseBody
    public String getPluginsActionSchema(@PathVariable("className") String className,@PathVariable("pluginName") String pluginName)
    {

        String requestAddr = "/api/components/actions/org.thingsboard.server.extensions.core.plugin."+className+"."+pluginName ;
        System.out.println(requestAddr);
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

    @RequestMapping(value = "/getPluginAction/{className}/{actionName}",method = RequestMethod.GET,produces = {"application/json;charset=UTF-8"})
    @ResponseBody
    public String getPluginsAction(@PathVariable("className") String className,@PathVariable("actionName") String actionName)
    {

        String requestAddr = "/api/component/org.thingsboard.server.extensions.core.action."+className+"."+actionName ;
        System.out.println(requestAddr);
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
    **/

    @RequestMapping(value = "/active/{ruleId}",method = RequestMethod.POST,produces = {"application/json;charset=UTF-8"})
    @ResponseBody
    public String active(@PathVariable("ruleId") String ruleId)
    {
        String requestAddr = "/api/rule/"+ruleId+"/activate";
        JsonObject requestbody=new JsonObject();

        String responseContent = null;
        try{
            responseContent = HttpUtil.sendPostToThingsboard("http://" + getSmartRulerServer() + requestAddr,
                    null,
                    requestbody,
                    request.getSession());
        }catch(Exception e){
            return retFail(e.toString()) ;
        }

        return retSuccess(responseContent);
    }

    @RequestMapping(value = "/suspend/{ruleId}",method = RequestMethod.POST,produces = {"application/json;charset=UTF-8"})
    @ResponseBody
    public String suspend(@PathVariable("ruleId") String ruleId)
    {
        String requestAddr = "/api/rule/"+ruleId+"/suspend";
        JsonObject requestbody=new JsonObject();

        String responseContent = null;
        try{
            responseContent = HttpUtil.sendPostToThingsboard("http://" + getSmartRulerServer() + requestAddr,
                    null,
                    requestbody,
                    request.getSession());
        }catch(Exception e){
            return retFail(e.toString()) ;
        }

        return retSuccess(responseContent);
    }

    @RequestMapping(value = "/delete/{ruleId}",method = RequestMethod.DELETE, produces = {"application/json;charset=UTF-8"})
    @ResponseBody
    public String deleteRules(@PathVariable("ruleId") String ruleId)
    {
        String requestAddr = "/api/rule/remove/"+ruleId;

        String responseContent = null;
        try{
            responseContent = HttpUtil.sendDeletToThingsboard("http://" + getSmartRulerServer() + requestAddr,
                    request.getSession());

        }catch(Exception e){
            return retFail(e.toString()) ;
        }
        return retSuccess(responseContent);
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST, produces = {"application/json;charset=UTF-8"})
    @ResponseBody
    public String createRule(@RequestBody String ruleInfo)
    {
        String requestAddr = "/api/rule/add";

        JsonObject ruleInfoJson = (JsonObject)new JsonParser().parse(ruleInfo);

        String responseContent = null;
        try{
            responseContent = HttpUtil.sendPostToThingsboard("http://" + getSmartRulerServer() + requestAddr,
                    null,
                    ruleInfoJson,
                    request.getSession());
        }catch(Exception e){
            return retFail(e.toString()) ;
        }

        return retSuccess(responseContent);
    }

    private String getErrorMsg(Exception e) {
        JsonObject errorInfoJson = new JsonObject();
        errorInfoJson.addProperty("responce_code", 1);
        errorInfoJson.addProperty("responce_msg", e.toString());
        return errorInfoJson.toString();
    }
}
