package com.middlemind.JsonPL;

import com.middlemind.JsonPL.JsonObjs.JsonObjSysBase;
import java.util.List;

/**
 *
 * @author Victor G. Brusca, Middlemind Games 03/28/2022 06:25 PM EDT
 */
public interface SystemFunctionHandler {

   public JsonObjSysBase call(String name, List<JsonObjSysBase> args);
}
